import React from 'react'

const TextImage = (props) => {

    let el = document.getElementById("canvasText")
    if (el) {
      document.body.removeChild(el)
    }

    let i = document.createElement("canvas")

    i.width=props.w;
    i.height=props.h;
    i.ctx=i.getContext("2d");
    return i;

  return (
    <div>
    {TextImage}
    </div>
  )
}

export default TextImage
