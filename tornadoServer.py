import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.httpserver
import os.path
import myMazeGame as mazelib
from itertools import chain

class myGame:
    def __init__(self):
        self.GameCapacity = 4
        self.numOfGames = 0
        self.Games = []

    def getNumberOfGames(self):
        return self.numOfGames
    
    def createGame(self):
        if self.numOfGames < self.GameCapacity:
            self.game = GameRoom()
            self.Games.append(game)
            self.GameNum += 1
    
    def getGame(self, gameNumber):
        return Games[gameNumber]


class GameRoom:
    def __init__(self):
        tempmaze = mazelib.createMaze()
        tempmaze = list(chain(*tempmaze))
        self.maze = ','.join(str(x) for x in tempmaze)
        self.sockets = []
        self.capacity = 4
        self.numOfPlayers = 0
        self.playersReady = 0

    def addPlayer(self, socket):
        self.sockets.append(socket)
        self.numOfPlayers += 1

    #call close on all sockets
    def gamefinished(self):
        pass

    def canIaddPlayer(self):
        return True if self.capacity > self.numOfPlayers else False

    def playerReady(self):
        self.playersReady += 1
        
        # send "start" message to every sockets in the game
        if self.playersReady == self.numOfPlayers:
            pass
    
class myWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print "Server Socket created!"
        
    def on_message(self, message):        
        print message
        self.write_message("Hello Back To You")

    def on_close(self):
        pass

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

def main():

    frontEndapp = tornado.web.Application(
        [ (r"/", MainHandler),
          ],)

    webSocketapp = tornado.web.Application(
        [ (r"/ws", myWebSocket),
          ],)

    #webSocketapp.listen(8001)
    #frontEndapp.listen(8000)
    
    tornado.httpserver.HTTPServer(frontEndapp).listen(8000)
    tornado.httpserver.HTTPServer(webSocketapp).listen(8001)
    
    tornado.ioloop.IOLoop.instance().start()
    

if __name__ == "__main__":
    main()
