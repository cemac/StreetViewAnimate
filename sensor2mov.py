import pandas as pd
from numpy import arctan2,random,sin,cos,degrees
import os,sys,time
import matplotlib.pyplot as plt
from sklearn.neural_network import MLPRegressor
import numpy as np
#NAME = sys.argv[1]
NAME = 'results_18_05_2020.csv'
SHORTNAME = NAME.replace('.csv','')
NCORES = 1

v=[]
for i in tuple(open(NAME,'r')):
    v.append(eval('{%s}'%i.strip('/n')))



df = pd.DataFrame(v[1:])

#tofloat
for i in 'lat lon gpstime'.split():
    df[i] = df[i].astype(float)


def convert_to_degrees(raw_value):
    decimal_value = raw_value/100.00
    degrees = int(decimal_value)
    mm_mmmm = (decimal_value - int(decimal_value))/0.6
    position = degrees + mm_mmmm
    #position = "%.4f" %(position)
    return position

for i in 'lat lon'.split():
    df[i] = [convert_to_degrees(j) for j in df[i]]




print(df.describe())

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
    dL = b.lon-a.lon
    X = cos(b.lat)* sin(dL)
    Y = cos(a.lat)*sin(b.lat) - sin(a.lat)*cos(b.lat)* cos(dL)
    #twice intentionally
    data.append(arctan2(X,Y))  
data.append(arctan2(X,Y))    
df['breal'] = 360 - ((degrees(data)+360)%360)

plt.clf()
# ax = df['breal'].plot()
# 
# by = 1
# 
# regr = MLPRegressor(hidden_layer_sizes=(2**30,2**20,2**11),random_state=1, max_iter=50000,activation='tanh').fit(np.array(df.index)[::by].reshape(-1,1),(df['breal'].values[::by])/360)
# # regr.predict()
# df['bearing'] = regr.predict(np.array(df.index).reshape(-1,1)).flatten()*360

df['bearing'] = [df['breal'].loc[(i-4):(i+4)].mean() for i in range(len(df))]


# df['bearing'].plot(ax=ax)

# plt.clf()

ax = df[[ 'PM10','PM2.5', 'PM1']].plot(figsize=(20,5))
ax.spines['left'].set_position('center')
#ax.spines['bottom'].set_position('center')
plt.subplots_adjust(left=0, right=1, top=1, bottom=0)

plt.savefig('measure.svg', transparent=True)


plt.close()




print(len(df))


commands = []
#intentionall serial at this point
for j,i in enumerate(df.iloc[:].iterrows()):
    i = i[1]
    cmd = 'electron main.js -a %s -o -%s -b %.4f -p %.2f -n %03d_%s -s '%(i['lat'],i['lon'],i['bearing'],float(j)/len(df),j,NAME)
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
