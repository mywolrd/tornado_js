import numpy as np
from collections import namedtuple
import random
import Queue

# to do
# threads or pyro?
# import threading

"""
 RecursiveBT from http://weblog.jamisbuck.org/2011/2/7/maze-generation-algorithm-recap
"""

Position = namedtuple('Position', 'x y')        
Cell = namedtuple('Cell', 'x y')

def createMaze(size):
    
    N,S,W,E = 8,4,2,1

    dx = {N: 0, S: 0, E: 1, W: -1}
    dy = {N: -1, S: 1, E: 0, W: 0 }
    opposite = {N: S, S: N, E:W, W:E}

    maze = np.zeros((size, size), dtype=np.int8)
    
    cellStack = Queue.LifoQueue()
    
    totalCells = size*size
    visitedCells = 1    
    current = Cell(0, 0)
    
    def findValidNeighbor():        
        status = False
        direction = None

        directions = [N,S,E,W]
        random.shuffle(directions)                
        for i in directions:
            x, y = current.x + dx[i], current.y + dy[i]
            if (0 <= x < size) and ( 0 <= y < size) and maze[x][y] == 0 :
                status = True
                direction = i
                break
        return (status, direction)

    while(visitedCells < totalCells):
                    
        status, direction = findValidNeighbor()
        if status:
            x, y = current.x + dx[direction], current.y + dy[direction]
            maze[current.x][current.y] |= direction
            maze[x][y] |= opposite[direction]
            
            cellStack.put(current)
            current = Cell(x,y)
            visitedCells += 1
        else:
            if not cellStack.empty():
                current = cellStack.get(False)
    return maze
        
