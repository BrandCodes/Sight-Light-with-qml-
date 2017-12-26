import QtQuick 2.5
import QtQuick.Window 2.2
import "CodeSL.js" as Im

Window {
    visible: true
    width: 750; height: 500
    Rectangle{
        width: 700; height: 450; color: "black"
        x: 25 ; y: 25;  radius: 4
        Canvas{
            id: lienzo
            width: 700; height: 450
            property real lastX
            property real lastY
            onPaint: {
                //Im.drawPolygon(lienzo);
                Im.drawFocus(lienzo,lastX,lastY)
                //Im.drawUniqueRays(lienzo,lastX,lastY)
                //Im.drawRays(lienzo,lastX,lastY)    //Im.drawRects(lienzo,50,50,150,50)
                //Im.drawPoint(lienzo,lastX,lastY)
            }
            MouseArea {
                id:area
                anchors.fill: parent
                hoverEnabled: true
                onPositionChanged: {
                    lienzo.lastX = mouseX
                    lienzo.lastY = mouseY
                    lienzo.requestPaint()
                }
            }
        }
    }//Fin Rectangle
}//Fin Window
