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
        
        game = self.findAvailableGame()
               
        if game:
            game.addPlayer(socket)
        else:
            if self.available:
                available = False
    
        return game

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
        self.ready = []
        self.capacity = 7
        self.numOfPlayers = 0
        self.sizew = 20
        self.sizeh = 10
        self.start = False
        
    def getMazeSize(self):
        return (self.sizew, self.sizeh)

    def getMaze(self, socket):
        index = self.sockets.index(socket)
        return self.mazes[index]

    def getId(self, soc):
        return self.sockets.index(soc)

    def getnumOfPlayers(self):
        return self.numOfPlayers

    def addPlayer(self, socket):

        maze = self.createMaze()
        self.numOfPlayers += 1

        if len(self.sockets) == self.capacity:
            self.modify_player(maze, socket)
        else:
            self.add_player(maze, socket)
            
    def modify_player(self, maze, socket):
        index = self.sockets.index(None)
        self.sockets[index] = socket
        self.mazes[index] = maze
        self.ready[index] = False

    def add_player(self, maze, socket):
        self.ready.append(False)
        self.mazes.append(maze)
        self.sockets.append(socket)
        
    def createMaze(self):
        maze = mazelib.createMaze(self.sizew, self.sizeh)
        maze = list(chain(*maze))
        maze = ','.join(str(x) for x in maze)
        return maze

    #call close on all sockets
    def gamefinished(self):
        pass

    def canIaddPlayer(self):
        return True if self.capacity > self.numOfPlayers and not self.start else False

    def everyoneReady(self):
        for socket in self.sockets:
            if socket:
                for maze in self.mazes:
                    if self.mazes.index(maze) != self.sockets.index(socket) and maze != "" :
                        socket.send_emaz(str(self.mazes.index(maze))+" "+maze)

        for socket in self.sockets:
            if socket:
                socket.send_start()

    def playerReady(self, socket):
        self.ready[self.sockets.index(socket)] = True
           
        # send "start" message to every sockets in the game
        if self.ready.count(True) == self.numOfPlayers:
            self.everyoneReady()			
            self.start = True
            
    def playerNotReady(self):
        self.playersReady -= 1

    def sendUpdate(self, socket, message):        
        for soc in self.sockets:
            if soc != socket and soc:
                soc.send_update(str(self.sockets.index(socket))+" "+message)

    def removePlayer(self, socket):

        index = self.sockets.index(socket)

        self.ready[index] = None
        self.mazes[index] = ""
        self.sockets[index] = None
        self.numOfPlayers -= 1

        if self.start:
            for socket in self.sockets:
                if socket:
                    socket.player_left(index)

class MywebSocketHandler(tornado.websocket.WebSocketHandler):
    
    def initialize(self, game):
        self.game = game

    def open(self):
        self.add_me()
        
    def send_emaz(self, maze):
        self.write_message("emaz "+maze)
        
    def send_maze(self):
        self.write_message("maze "+ str(self.id)+" "+str(self.sizew)+" "
                           +str(self.sizeh)+" "+self.maze)

    def send_start(self):
        self.write_message("strt ") 

    def send_update(self, update):
        self.write_message("updt " + update)

    def add_me(self):
        
        self.ingame = False
        game = self.game.addPlayer(self)
        
        if game:
            self.game = game
            self.ingame = True
            self.sizew, self.sizeh = self.game.getMazeSize()
            self.maze = self.game.getMaze(self)
            self.id = self.game.getId(self)
            self.send_maze()
        
        else:
            self.ingame = False
            self.write_message("fail " + "CAN\'T JOIN")

    def on_message(self, message):                		        
        # if a client is ready for a game
        if "ready" in message:
            self.game.playerReady(self)

        if "update" in message:
            self.game.sendUpdate(self, message[7:])

    def player_left(self, index):
        self.write_message("left " + str(index))

    def on_close(self):
        if self.ingame:
            self.game.removePlayer(self)

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
