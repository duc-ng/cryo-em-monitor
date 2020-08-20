#!/usr/bin/env python 

#var
outputFolder='data4Web/'
MicName='Titan1'
pathToSimData='simData/'
numOfCycles=40

#const
imgProp=['rawAvg','psRawAvg','motionCorrAvg','psMotionCorrAvg','driftplot','ctfdiag']
dataProp=['mean','drift','iciness','defocus','resolution','ccOfCtfFit']
from collections import namedtuple
Apause = namedtuple("ImgToIMg", "ImgToIMg b4Import b4Process b4Export")
#Apause = Apause(ImgToIMg=1, b4Import=1, b4Process=1,b4Export=1)
Apause = Apause(ImgToIMg=0.5, b4Import=0.5, b4Process=0.5,b4Export=0.5)


simErr={'imgErrorIdx':1,'imgNotExportedIdx':3}
simFields={'additionalDataField':4,'additionalImgField':5}


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

def appendTime(fieldName,fieldValue,actRoot):
    os.system('echo ' +  fieldName + ' >> ' + actRoot + '/ProcTimes.head')
    if (fieldValue==0):
        fieldValue = str(0)
    else:
        fieldValue = datetime.datetime.fromtimestamp(fieldValue).strftime('%Y-%m-%d-%H:%M:%S')
    os.system('printf "%s \t " "' + fieldValue + '" >> '  + actRoot + '/ProcTimes.dat')


def genImageStar(actRoot,actName,pathToSimData,imgProp,key):
    os.system('echo "data_image" > ' + actRoot + '/Img.head')
    os.system('echo "" >> ' + actRoot + '/Img.head')
    os.system('echo "loop_" >> ' + actRoot + '/Img.head')
    os.system('echo "" >> ' + actRoot + '/Img.head')
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
    
    os.system('cat ' + actRoot + '/Img.head ' + actRoot + '/Img.dat' + ' > ' +  actRoot + '/images.star')    
    
def writeProcessingStar(actRoot,key,AcquTime,ImpTime,ProcTime,ExpTime,ErrorTime):    
   
    os.system('printf "\n "  > '  + actRoot + '/ProcTimes.dat')
    os.system('echo "data_procTimes" > ' + actRoot + '/ProcTimes.head')
    os.system('echo "" >> ' + actRoot + '/ProcTimes.head')
    os.system('echo "loop_" >> ' + actRoot + '/ProcTimes.head')
    os.system('echo "" >> ' + actRoot + '/ProcTimes.head')  
    os.system('echo ' + '_mmsImageKey_Value >> ' + actRoot + '/ProcTimes.head')
    os.system('printf "%d \t " ' + key + ' >> '  + actRoot + '/ProcTimes.dat')
    
    appendTime('_mmsdateAuqired_Value',AcquTime,actRoot)
    appendTime('_mmsdateImported_Value',ImpTime,actRoot)
    appendTime('_mmsdateProcessed_Value',ProcTime,actRoot)
    appendTime('_mmsdateExported_Value',ExpTime,actRoot)
    appendTime('_mmsdateError_Value',ErrorTime,actRoot)
    
    os.system('cat ' + actRoot + '/ProcTimes.head ' + actRoot + '/ProcTimes.dat' + ' > ' +  actRoot + '/times.star')

def genDataStar(actRoot,dataProp,key):
    os.system('printf "\n "  > '  + actRoot + '/Data.dat')
    os.system('echo "data_measure" > ' + actRoot + '/Data.head')
    os.system('echo "" >> ' + actRoot + '/Data.head')
    os.system('echo "loop_" >> ' + actRoot + '/Data.head')
    os.system('echo "" >> ' + actRoot + '/Data.head')
    
    os.system('echo ' + '_mmsImageKey_Value >> ' + actRoot + '/Data.head')
    os.system('printf "%d \t " ' + key + ' >> '  + actRoot + '/Data.dat')
    
    
    for actDataProp in dataProp:  
        os.system('echo ' + '_mms' + actDataProp + '_Value >> ' + actRoot + '/Data.head')
        os.system('echo ' + '_mms' + actDataProp + '_Info >> ' + actRoot + '/Data.head')
        os.system('printf "%s \t" ' + str(random()) + ' >> '  + actRoot + '/Data.dat')
        os.system('printf "\\"%s\\" \t" ' + str('"infomation for ' + actDataProp + '"' ) + ' >> '  + actRoot + '/Data.dat')
    os.system('printf "\n "  >> '  + actRoot + '/Data.dat')
    
        
    os.system('cat ' + actRoot + '/Data.head ' + actRoot + '/Data.dat' + ' > ' +  actRoot + '/data.star')



def processSimCycle(basepath,simErr,simFields,CycNr):

 os.system('mkdir -p ' + basepath )
 imgNames=getImgNamesFromFolder(pathToSimData + '/rawAvg/*.png')

 counter=1
 for actName in imgNames:
    
    
    actRoot=basepath + '/' + actName + 'Cycle' + str(CycNr)
    print("processing: " + actName + " ==> " + actRoot + " " + str(counter) + ' of ' + str(len(imgNames)) )
    os.system('mkdir -p ' + actRoot)
    
    if (counter==simFields['additionalDataField']):
        print("  ==>data field added")
        dataProp.append('astigmatism')
        
    if (counter==simFields['additionalImgField']):
        print("  ==>image field added")
        imgProp.append('pick')
            
    #Acquision
    acqTime=time.time();
    key=str(int(round(acqTime*1000000)))
    writeProcessingStar(actRoot,key,acqTime,0,0,0,0)
            
    #Import 
    time.sleep(Apause.b4Import)
    impTime=time.time()
    writeProcessingStar(actRoot,key,acqTime,impTime,0,0,0)
            
    #Processing
    genImageStar(actRoot,actName,pathToSimData,imgProp,key)
    genDataStar(actRoot,dataProp,key)
    time.sleep(Apause.b4Process)
    procTime=time.time()
    writeProcessingStar(actRoot,key,acqTime,impTime,procTime,0,0)
            
    #Export
    time.sleep(Apause.b4Export)
    expTime=time.time()
    if counter==simErr['imgErrorIdx']:
        print("  ==>simulated error")
        writeProcessingStar(actRoot,key,acqTime,impTime,procTime,0,expTime)
    else:
        if counter==simErr['imgNotExportedIdx']:
                print("  ==>simulated no export")
                writeProcessingStar(actRoot,key,acqTime,impTime,procTime,0,0)
        else:         
                writeProcessingStar(actRoot,key,acqTime,impTime,procTime,expTime,0)
                os.system('rm ' + actRoot + '/*.dat')
                os.system('rm ' + actRoot + '/*.head')
                time.sleep(Apause.ImgToIMg)
    
    counter=counter+1
                            




#Main
basepath=outputFolder + MicName  + '/' + date.today().strftime("%d-%m-%Y")

for iCy in range(1,numOfCycles+1):
  print "  "
  print "cycle Nr: " + str(iCy)
  processSimCycle(basepath,simErr,simFields,iCy)
  print " "  
