import pandas as pd
from numpy import arctan2,random,sin,cos,degrees
import os,sys,time

#NAME = sys.argv[1]
NAME = 'demo.csv'
SHORTNAME = NAME.replace('.csv','')
NCORES = 1

#columns of index,conc,lat and lon
df = pd.read_csv(NAME)

# theta = arctan (y/x)
# lat = 50 # lon = 0 
data = []
for i in range(1,len(df)):
    '''
    β = atan2(X,Y),

    L - longitude
    theta = latitude

    X = cos θb * sin ∆L

    Y = cos θa * sin θb – sin θa * cos θb * cos ∆L

    '''

    a = df.iloc[i-1]
    b = df.iloc[i]

    X = cos(b.lat)* sin(b.lon-a.lon)
    Y = cos(a.lat)*sin(b.lat) - sin(a.lat)*cos(b.lat)* cos(b.lon-a.lon)
    
    
    data.append(arctan2(X,Y))
    
data.append(arctan2(X,Y))    
df['bearing'] = 360 - ((degrees(data)+360)%360)

print(len(df))


commands = []
#intentionall serial at this point
for i in df.iloc[:].iterrows():
    i = i[1]
    cmd = 'electron main.js -a %s -o %s -b %.4f -n %03d_%s -s'%(i['lat'],i['lon'],i['bearing'],i[0],NAME)
    commands.append(cmd)
    
    
def multiple(cmd):
    import os, time
    from numpy import random 
    
    time.sleep(10*random.random())
    os.system(cmd)
    
    time.sleep(10*random.random())


from multiprocessing import Pool

Pool(NCORES).map(multiple,commands)

# post process fish eye
#https://github.com/ericleong/fisheye.js/tree/master

# ffmpeg -r 539 -f image2 -s 1920x1080 -start_number 1 -i satellite_%03d_demo.csv.png -vframes 10 -vcodec libx264 -crf 25  -pix_fmt yuv420p test.mp4

# ffmpeg -r 10 -f image2 -s 1920x1080 -i satellite_%*_demo.csv.png -vcodec libx264 -crf 25  -pix_fmt yuv420p test.mp4

# 
# def testplot(df):
#     import matplotlib.pyplot as plt 
#     plt.plot(df.lat,df.lon)
#     #plt.barbs(df.lat,df.lon,cos(df['bearing']),sin[df['bearing']])
#     plt.plot(df['bearing'])
#     plt.show()
