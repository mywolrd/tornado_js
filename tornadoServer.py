import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.httpserver
import os.path
import random
import myMazeGame as mazelib
from itertools import chain
import time

class Game:
    def __init__(self):
        self.GameCapacity = 1
        self.numOfGames = 0
        self.available = True
        self.games = []

    def getNumberOfGames(self):
        return self.numOfGames
    
    def createGame(self):
        if self.numOfGames < self.GameCapacity:
            game = GameRoom()
            self.games.append(game)
            self.numOfGames += 1
            return game
        else:
            return None
    
    def addPlayer(self, socket):

        maze = None
        size = None
        game = self.findAvailableGame()
               
        if game:
            maze = game.addPlayer(socket)
            if maze:
                size = game.getSize()
            else:
                game = None
        else:
            if self.available:
                available = False
    
        return (game, (size, maze))

    def findAvailableGame(self):

        game = None

        if self.available:
            if self.games and self.games[self.numOfGames-1].canIaddPlayer():
                game = self.games[self.numOfGames-1]
            else:
                game = self.createGame()
        return game
   
class GameRoom:
    def __init__(self):

        self.sockets = []
        self.mazes = []
        self.ids = []
        self.capacity = 7
        self.numOfPlayers = 0
        self.playersReady = 0
        self.sizew = 20
        self.sizeh = 10
        self.start = False
        
    def getSize(self):
        return (self.sizew, self.sizeh)

    def getnumOfPlayers(self):
        return self.numOfPlayers

    def addPlayer(self, socket):
        if self.numOfPlayers < self.capacity:
            maze = mazelib.createMaze(self.sizew, self.sizeh)
            maze = list(chain(*maze))
            maze = ','.join(str(x) for x in maze)

            self.mazes.append(maze)
            self.sockets.append(socket)
            self.numOfPlayers += 1
            return self.mazes[self.numOfPlayers-1]
        else:
            return None

    #call close on all sockets
    def gamefinished(self):
        pass

    def canIaddPlayer(self):
        return True if self.capacity > self.numOfPlayers else False

    def everyoneReady(self):
        for socket in self.sockets:
            for maze in self.mazes:
                if self.mazes.index(maze) != self.sockets.index(socket):
                    socket.send_emaz(maze)

        for socket in self.sockets:
            socket.send_start()

    

    def playerReady(self):
        self.playersReady += 1
        
        # send "start" message to every sockets in the game
        if self.playersReady == self.numOfPlayers:
            self.everyoneReady()			
            self.start = True
            
    def playerNotReady(self):
        self.playersReady -= 1

    def removePlayer(self, socket):
        pass

class MywebSocketHandler(tornado.websocket.WebSocketHandler):
    
    def initialize(self, game):
        self.game = game

    def open(self):
        self.add_player()
        
    def send_emaz(self, maze):
        self.write_message("emaz " + maze)
        
    def send_maze(self):
        self.write_message("maze "+str(self.sizew)+" "
                           +str(self.sizeh)+" "+self.maze)

    def send_start(self):
        self.write_message("strt ") 

    def send_update(self, update):
        self.write_message("updt " + update)

    def add_player(self):

        game, mazeinfo = self.game.addPlayer(self)
        
        if game:
            self.game = game
            size, self.maze = mazeinfo
            
            self.sizew, self.sizeh = size
            self.send_maze()
        else:
            self.write_message("fail " + "CAN\'T JOIN")

    def on_message(self, message):                		        
        # if a client is ready for a game
        if "ready" in message:
            self.game.playerReady()

        if "notrd" in message:
            pass
        
        if "update" in message:
            print message

    def on_close(self):
        pass

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")


def main():

    myGame = Game()

    frontEndapp = tornado.web.Application(
        [ (r"/", MainHandler),
          ],)

    webSocketapp = tornado.web.Application(
        [ (r"/ws", MywebSocketHandler, dict(game=myGame)),
          ],)

    #webSocketapp.listen(8001)
    #frontEndapp.listen(8000)
    
    tornado.httpserver.HTTPServer(frontEndapp).listen(8000)
    tornado.httpserver.HTTPServer(webSocketapp).listen(8001)
    
    tornado.ioloop.IOLoop.instance().start()
    
if __name__ == "__main__":
    main()
