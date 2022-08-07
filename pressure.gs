*======================================================================
* pressure.gs
*======================================================================
*
* This piece of GrADS code graphs the pressure in the domain stated
* in the pressure.gs program. Given this information an image will
* be displayed and will be saved into a *.gif file in the current
* /map directory.
*
*
----------------------------------------------------------------------
* List of arguments
*----------------------------------------------------------------------
*
* t = temperature in K
* ps = surface pressure in hPa
* R = dry gas constant
* rho = density
*
*
----------------------------------------------------------------------
*
* @Author : Skylar Hernandez
* @Date : November 14, 2008
* @Version: 1.0.0
* @Comment: Modified version of HRS Graphics Package by Sky Hernandez.
* @Execution:
* run pressure.gs
*
*======================================================================
*
** Openning a control file.
*
   "open model.ctl"
*
** Reset all settings
*
   "reset"
*
** Constants
*
   "R = 287.0"
*
** Settings for the first graphic
*
   "clear"
   "set display color white"
   "set gxout shaded"
   "set csmooth on"
   "set grads off"
   "set cint 50"
   "set clab off"
*
** Uservar provides us options to graph certian features and not do
** others.
*
   uservar = 1
   if (uservar = 1)
      "clear"
      "d ps"
      "set gxout contour"
      "set ccolor 15"
      "set clab on"
      "set cint .01"
*
** Using a GrADS subroutine.
*
      "rho = " rho(ps,t,R)
      "d " rho
    endif
*
** The while loop allows us to do all options.
*
    while(uservar <= 3)
       say uservar
       if (uservar = 1)
          "clear"
          "set gxout shaded"
          "set csmooth on"
          "d ps"
          "set gxout contour"
          "set ccolor 15"
          "set clab on"
          "set cint .01"
          "rho = " rho(ps,t,R)
          "d " rho
          "printim ps_rho.gif"
          "!mv ps_rho.gif maps"
        endif
        if (uservar = 2)
          "clear"
          "set gxout shaded"
          "set csmooth on"
          "d ps"
          "set gxout contour"
          "set ccolor 15"
          "set clab on"
          "set cint 5"
          "d t"
          "printim ps_t.gif"
          "!mv ps_t.gif maps"
        endif
        if (uservar = 3)
          "clear"
          "set gxout shaded"
          "set csmooth on"
          "d ps"
          "printim ps.gif"
          "!mv ps.gif maps"
        endif
        uservar = uservar + 1
    endwhile

*======================================================================
* Function rho
*======================================================================
   function rho(ps,t,R)
       "rho = ps*100/(R*t)"
       say "Done! Rho has been calculated"
   return(rho)
*======================================================================
* End of file
*======================================================================
