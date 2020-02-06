*-----------------------------------------------------------------------
*                               cps_bvtl.gs
*-----------------------------------------------------------------------
* This program will plot multiple hurricane cyclone phase spaces (CPS)
* provided by some model ensemble, which has been devided up into at
* most 6 clusters.  If you don't have all the 6 clusters then please 
* under filename* place nothing.track.
*
* This code will draw up the physical CPS valuetracks of ensemble member 
* forecasts in light colored lines and then plots the CPS cluster 
* membership of each ensemble member at the end of the forecast 
* period using the same colored marker that pertains to its cluster on 
* a CPS diagram.
*
*  UPDATE:  Mike Hernandez editted Aviva's original track code and 
*           combined it with the current CPS graphics code to include
*           the opening and closing files in a loop.  Also he cleaned
*           cleaned up the codes considerably.
*----------------------------------------------------------------------
* @authors: Aviva Braun, Michael Kevin Hernandez, Mark Guishard
* @emails : braun@meteo.psu.edu, mkh182@psu.edu
* @date   : unknown
* @update : 2/8/2010
* @version: 1.1
*----------------------------------------------------------------------

"reinit"
"open sl_e4_20080922_00.ctl"
"set display color white"
"clear"


***********************************************************************
** Plots multple tracks from input files                             **
***********************************************************************
** Each track and average track data must be in the format as shown  **
** below for the code to work:                                       **
**  YYYYMMDDCC LAT LON PRES WIND Bvalue VTL  VTU ....                **
**  YYYYMMDDCC LAT LON PRES WIND Bvalue VTL  VTU ....                **
**  ...                                                              **
***********************************************************************
**                         User edit area                            **
***********************************************************************

** Best track data
   filename1="nothing.track"
** Average of all 51 ensemble members
   filename2="nothing.track"
** Cluster tracks
   filename3="nothing.track"
   filename4="crap.track"
   filename5="nothing.track"
   filename6="nothing.track"
   filename7="nothing.track"
   filename8="nothing.track"
** Cluster average tracks
   filename9="nothing.track"
   filename10="nothing.track"
   filename11="nothing.track"
   filename12="nothing.track"
   filename13="nothing.track"
   filename14="nothing.track"

"set parea 1 10 1 7.5"

minV = -600
maxV = 300
minB = -50
maxB = 125
title = "ECMWF Ensemble Member Forecast Cyclone Phase Space \for Typhoon Sinlaku"

***********************************************************************
**                         User stop edit                            **
***********************************************************************
** This part of the code sets the initial plotting area, the thres-  **
** hold lines for B and the axes labels.  Don't mess with this part. **
***********************************************************************
"set x "minV " "maxV""
"set y "minB " "maxB""

"set xaxis " minV " " maxV " 100"
"set yaxis " minB " " maxB " 50"

"set clevs 500"
"set xlopts 1 5 0.16"
"set ylopts 1 5 0.16"
"set grads off"
"set mpdraw off"
"d lat"

"draw title "title

"set strsiz 0.25 0.25"
"draw string 5 0.25 -V`bT`n`aL`n"
"set strsiz 0.25 0.25"
"set string 1 c 4 90"
"draw string 0.25 4 B"
"set strsiz 0.13 0.13"

"q gr2xy 0  "minB
xloc1=subwrd(result,3)
yloc1=subwrd(result,6)

"q gr2xy 0  "maxB
xloc2=subwrd(result,3)
yloc2=subwrd(result,6)

"q gr2xy "minV" 0"
xloc3=subwrd(result,3)
yloc3=subwrd(result,6)

"q gr2xy "maxV" 0"
xloc4=subwrd(result,3)
yloc4=subwrd(result,6)

"q gr2xy "minV" 10"
xloc5=subwrd(result,3)
yloc5=subwrd(result,6)

"q gr2xy "maxV" 10"
xloc6=subwrd(result,3)
yloc6=subwrd(result,6)


"draw line "xloc1 " " yloc1 " " xloc2  " "yloc2
"draw line "xloc3 " " yloc3 " " xloc4  " "yloc4

"set line 15 3 1"
"draw line "xloc5 " " yloc5 " " xloc6  " "yloc6


***********************************************************************
** This will plot each member of each cluster.  Each member's track  **
** track is sperated by a space which GrADS doesn't like it, thus it **
** gives out these errors:                                           **
**   Query Error: Syntax is QUERY W2XY Lon Lat                       **
**   DRAW error: Invalid LINE coordinate                             **
**   DRAW error: Invalid LINE coordinate                             **
***********************************************************************
updown=7
rc=1
count=1
file=3


while (file < 9)
   color = file + 1
   if (file=3); nombre=filename3; endif
   if (file=4); nombre=filename4; endif
   if (file=5); nombre=filename5; endif
   if (file=6); nombre=filename6; endif
   if (file=7); nombre=filename7; endif
   if (file=8); nombre=filename8; endif


   while (rc != 2)
      data=read(nombre)
      rc=sublin(data,1)

      if (rc != 2)
         line=sublin(data,2)
         chk=substr(line,1,10)
         if(chk != "--------")

            if(count=1)
              B1=subwrd(line,6)
              VTL1=subwrd(line,7)
              "q gr2xy "VTL1 " " B1
              xloc8=subwrd(result,3)
              yloc8=subwrd(result,6)

              "set strsiz 0.15 0.15"
              "set string "color" c 4 0"
              "draw string "xloc8" "yloc8" A"

            else

              B2=subwrd(line,6)
              VTL2=subwrd(line,7)
              say B2 " " VTL2  "   " count
              "q gr2xy "VTL2 " " B2
              xloc9=subwrd(result,3)
              yloc9=subwrd(result,6)
                "set line "color " 1 4"
                "draw line "xloc9  " "yloc9  " "xloc8  " "yloc8
              B1=B2
              VTL1=VTL2
              xloc8=xloc9
              yloc8=yloc9

            endif
            count = count + 1
            if (chk = "")
               count = 1
            endif
         endif
     endif
   endwhile
   file = file+1
   rc=close(nombre)
endwhile

************************************************************************
** This part of the code calculates the average of each cluster.      **
** Special note:  The ave*.track must have a space in the end, so that** 
**                the lines could be one seperate line instead of some**
**                polygon.                                            **
************************************************************************

updown=7
rc=1
count=1
color=3

file=9

while (file < 15)
   color = file - 5
   if (file=9); nombre=filename9; endif
   if (file=10); nombre=filename10; endif
   if (file=11); nombre=filename11; endif
   if (file=12); nombre=filename12; endif
   if (file=13); nombre=filename13; endif
   if (file=14); nombre=filename14; endif

   while (rc != 2)
      data=read(nombre)
      rc=sublin(data,1)

      if (rc != 2)
         line=sublin(data,2)
         chk=substr(line,1,10)
         if(chk != "--------")

            if(count=1)
              B1=subwrd(line,6)
              VTL1=subwrd(line,7)
              "q gr2xy "VTL1 " " B1
              xloc8=subwrd(result,3)
              yloc8=subwrd(result,6)

              "set strsiz 0.15 0.15"
              "set string "color" c 4 0"
              "draw string "xloc8" "yloc8" A"

            else

              B2=subwrd(line,6)
              VTL2=subwrd(line,7)
              say B2 " " VTL2  "   " count
              "q gr2xy "VTL2 " " B2
              xloc9=subwrd(result,3)
              yloc9=subwrd(result,6)
                "set line "color " 1 4"
                "draw line "xloc9  " "yloc9  " "xloc8  " "yloc8
              B1=B2
              VTL1=VTL2
              xloc8=xloc9
              yloc8=yloc9

            endif
            count = count + 1
            if (chk = "")
               count = 1
            endif
         endif
     endif
   endwhile
  file = file+1
  rc=close(nombre)
endwhile

*********************************************************************
** Plotting best track data                                        **
*********************************************************************
updown=7
rc=1
count=1
color=1

   while (rc != 2)
      data=read(nombre)
      rc=sublin(data,1)

      if (rc != 2)
         line=sublin(data,2)
         chk=substr(line,1,10)
         if(chk != "--------")

            if(count=1)
              B1=subwrd(line,6)
              VTL1=subwrd(line,7)
              "q gr2xy "VTL1 " " B1
              xloc8=subwrd(result,3)
              yloc8=subwrd(result,6)

              "set strsiz 0.15 0.15"
              "set string "color" c 4 0"
              "draw string "xloc8" "yloc8" A"

            else

              B2=subwrd(line,6)
              VTL2=subwrd(line,7)
              say B2 " " VTL2  "   " count
              "q gr2xy "VTL2 " " B2
              xloc9=subwrd(result,3)
              yloc9=subwrd(result,6)
                "set line "color " 1 4"
                "draw line "xloc9  " "yloc9  " "xloc8  " "yloc8
              B1=B2
              VTL1=VTL2
              xloc8=xloc9
              yloc8=yloc9

            endif
            count = count + 1
            if (chk = "")
               count = 1
            endif
         endif
     endif
   endwhile

rc=close(filename1)

****************************************************************************
** Plotting Average of all 51 members                                     **
****************************************************************************
updown=7
rc=1
count=1
color=2

   while (rc != 2)
      data=read(nombre)
      rc=sublin(data,1)

      if (rc != 2)
         line=sublin(data,2)
         chk=substr(line,1,10)
         if(chk != "--------")

            if(count=1)
              B1=subwrd(line,6)
              VTL1=subwrd(line,7)
              "q gr2xy "VTL1 " " B1
              xloc8=subwrd(result,3)
              yloc8=subwrd(result,6)

              "set strsiz 0.15 0.15"
              "set string "color" c 4 0"
              "draw string "xloc8" "yloc8" A"

            else

              B2=subwrd(line,6)
              VTL2=subwrd(line,7)
              say B2 " " VTL2  "   " count
              "q gr2xy "VTL2 " " B2
              xloc9=subwrd(result,3)
              yloc9=subwrd(result,6)
                "set line "color " 1 4"
                "draw line "xloc9  " "yloc9  " "xloc8  " "yloc8
              B1=B2
              VTL1=VTL2
              xloc8=xloc9
              yloc8=yloc9

            endif
            count = count + 1
            if (chk = "")
               count = 1
            endif
         endif
     endif
   endwhile

rc=close(filename2)

***************************************************************************

"printim CPS_BVTL.gif"

*--------------------------------------------------------------------------
* End of program
*--------------------------------------------------------------------------
