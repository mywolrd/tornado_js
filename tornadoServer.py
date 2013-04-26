import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.httpserver
import os.path
import random
import myMazeGame as mazelib
from itertools import chain

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
            size = game.getSize()
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
        self.capacity = 1000
        self.numOfPlayers = 0
        self.playersReady = 0
        self.sizew = 20
        self.sizeh = 10
        
    def getSize(self):
        return (self.sizew, self.sizeh)

    def getnumOfPlayers(self):
        return self.numOfPlayers

    def addPlayer(self, socket):
        if self.numOfPlayers < self.capacity:
            maze = mazelib.createMaze(self.sizew, self.sizeh)
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
        i,j = 0
        while(i < self.numOfPlayers):            
            while( (i != j) and j < self.numOfPlayers ):
                self.sockets[j].send_maze()
                j += 1

            i += 1
            j = 0

    def playerReady(self):
        self.playersReady += 1
        
        # send "start" message to every sockets in the game
        if self.playersReady == self.numOfPlayers:
            for socket in self.sockets:
                socket.write_message("strt ");
    
    def removePlayer(self, socket):
        pass

class MywebSocketHandler(tornado.websocket.WebSocketHandler):
    
    def initialize(self, game):
        self.game = game

    def open(self):
        self.add_player()
        
    def send_emaz(self):
        self.write_message("emaz "+self.maze)
        
    def send_maze(self):
        self.write_message("maze "+str(self.sizew)+" "
                           +str(self.sizeh)+" "+self.maze)

    def add_player(self):

        game, mazeinfo = self.game.addPlayer(self)
        
        if game:
            size, maze = mazeinfo
            
            maze = list(chain(*maze))
            self.maze = ','.join(str(x) for x in maze)
            self.sizew, self.sizeh = size
            self.send_maze()
        else:
            self.write_message("fail " + "CAN\'T JOIN")

    def on_message(self, message):                
        # if a client is ready for a game
        if "ready" in message:
            pass

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
