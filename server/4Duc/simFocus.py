#!/usr/bin/env python 

#var
outputFolder='data4Web/'
MicName='Titan1'
pathToSimData='simData/'
#const
imgProp=['rawAvg','psRawAvg','motionCorrAvg','psMotionCorrAvg','driftplot','ctfdiag','pick']
imgDescr=['raw average','ps of raw average']
dataProp=['mean','drift','iciness','defocus','resolution','ccOfCtfFit']
pauseInSec=4


from datetime import date
import datetime
from random import random
import os
import time


def getImgNamesFromFolder(wk):
  import glob
  import ntpath
  allImgPath=glob.glob(wk)
  
  
  allNames=[]
  for imgName in allImgPath:
    tmpName=ntpath.basename(imgName)
    tmpName=os.path.splitext(tmpName)[0]
    allNames.append(tmpName)
  
  return allNames


#Main
basepath=outputFolder + MicName  + '/' + date.today().strftime("%d-%m-%Y")
os.system('mkdir -p ' + basepath )
imgNames=getImgNamesFromFolder(pathToSimData + '/rawAvg/*.png')

for actName in imgNames:
    print("processing: " + actName)
    time.sleep(pauseInSec)
    actRoot=basepath + '/' + actName
    os.system('mkdir -p ' + actRoot)
    os.system('echo "data_image" > ' + actRoot + '/Img.head')
    os.system('echo "" >> ' + actRoot + '/Img.head')
    os.system('echo "loop_" >> ' + actRoot + '/Img.head')
    os.system('echo "" >> ' + actRoot + '/Img.head')
    key=str(int(round(time.time()*1000000)))
    os.system('echo ' + '_mmsImageKey_Value >> ' + actRoot + '/Img.head')
    os.system('printf "%d \t " ' + key + ' >> '  + actRoot + '/Img.dat')
    for actImgProp in imgProp:  
        sourceName=pathToSimData + '/' + actImgProp + '/' + actName + '.png' 
        targetName=actRoot + '/' +  actImgProp + '.png'
        os.system("cp " + sourceName + " " + targetName)
        os.system('echo ' + '_mms' + actImgProp + '_Name >> ' + actRoot + '/Img.head') 
        os.system('echo ' + '_mms' + actImgProp + '_Info >> ' + actRoot + '/Img.head')
        os.system('printf "%s \t " ' + actImgProp + '.png ' + ' >> ' + actRoot + '/Img.dat') 
        os.system('printf "\\"%s\\" \t" ' + str('"infomation for ' + actImgProp + '"' ) + ' >> '  + actRoot + '/Img.dat')
    os.system('printf "\n "  >> '  + actRoot + '/Data.dat')
   
    os.system('echo "data_measure" > ' + actRoot + '/Data.head')
    os.system('echo "" >> ' + actRoot + '/Data.head')
    os.system('echo "loop_" >> ' + actRoot + '/Data.head')
    os.system('echo "" >> ' + actRoot + '/Data.head')
    
    os.system('echo ' + '_mmsImageKey_Value >> ' + actRoot + '/Data.head')
    os.system('printf "%d \t " ' + key + ' >> '  + actRoot + '/Data.dat')
    ts=time.time()
    stTime = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d-%H:%M:%S')
    os.system('echo ' + '_mmsdateAuqired_Value >> ' + actRoot + '/Data.head')
    os.system('printf "%s \t " "' + stTime + '" >> '  + actRoot + '/Data.dat')
    os.system('echo ' + '_mmsdateImported_Value >> ' + actRoot + '/Data.head')
    os.system('printf "%s \t " ' + stTime + ' >> '  + actRoot + '/Data.dat')
    os.system('echo ' + '_mmsdateProcessed_Value >> ' + actRoot + '/Data.head')
    os.system('printf "%s \t " ' + stTime + ' >> '  + actRoot + '/Data.dat')
    os.system('echo ' + '_mmsdateExported_Value >> ' + actRoot + '/Data.head')
    os.system('printf "%s \t " ' + stTime + ' >> '  + actRoot + '/Data.dat')
    
    for actDataProp in dataProp:  
        os.system('echo ' + '_mms' + actDataProp + '_Value >> ' + actRoot + '/Data.head')
        os.system('echo ' + '_mms' + actDataProp + '_Info >> ' + actRoot + '/Data.head')
        os.system('printf "%s \t" ' + str(random()) + ' >> '  + actRoot + '/Data.dat')
        os.system('printf "\\"%s\\" \t" ' + str('"infomation for ' + actDataProp + '"' ) + ' >> '  + actRoot + '/Data.dat')
    os.system('printf "\n "  >> '  + actRoot + '/Data.dat')
    
    os.system('cat ' + actRoot + '/Img.head ' + actRoot + '/Img.dat' + ' > ' +  actRoot + '/images.star')    
    os.system('cat ' + actRoot + '/Data.head ' + actRoot + '/Data.dat' + ' > ' +  actRoot + '/data.star')
    os.system('rm ' + actRoot + '/*.dat')
    os.system('rm ' + actRoot + '/*.head')
    
