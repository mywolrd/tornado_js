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
        self.GameCapacity = 4
        self.numOfGames = 0
        self.available = True
        self.games = []

    def getNumberOfGames(self):
        return self.numOfGames
    
    def createGame(self):
        if self.numOfGames <= self.GameCapacity:
            game = GameRoom()
            self.games.append(game)
            self.numOfGames += 1
            return game
        else:
            return None
    
    def addPlayer(self, socket):

        maze = None
        game = self.findAvailableGame()
        size = 0

        if game:
            game.addPlayer(socket)
            maze = game.getMaze()
            size = game.getSize()
        else:
            if self.available:
                available = False
        
        return (size, maze)

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
        self.capacity = 4
        self.numOfPlayers = 0
        self.playersReady = 0
        self.size = 10
        self.createMaze()

    def createMaze(self):
        tempmaze = mazelib.createMaze(self.size)
        tempmaze = list(chain(*tempmaze))
        self.maze = ','.join(str(x) for x in tempmaze)

    def getSize(self):
        return self.size

    def getMaze(self):
        return self.maze

    def getnumOfPlayers(self):
        return self.numOfPlayers

    def addPlayer(self, socket):
        if self.numOfPlayers < self.capacity:
            self.sockets.append(socket)
            self.numOfPlayers += 1
            return True
        else:
            False

    #call close on all sockets
    def gamefinished(self):
        pass

    def canIaddPlayer(self):
        return True if self.capacity > self.numOfPlayers else False

    def playerReady(self):
        self.playersReady += 1
        
        # send "start" message to every sockets in the game
        if self.playersReady == self.numOfPlayers:
            for socket in self.sockets:
                socket.write_message("strt ");
    
class MywebSocketHandler(tornado.websocket.WebSocketHandler):
    
    def initialize(self, game):
        self.game = game

    def open(self):
        size, maze = self.game.addPlayer(self)

        if maze:
            self.write_message("maze "+ str(size) + " " + maze)
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
