import axios from "axios";
import { useEffect, useState } from "react";
import Helper from "../Helper";

function Card(props){   
    const [image, setImage] = useState('');

    useEffect(
        ()=>{
          var imageLink = Helper.trimString(props.data.img, 'png');
          imageLink = Helper.trimString(imageLink, 'PNG');
          imageLink = Helper.trimString(imageLink, 'gif');
          imageLink = Helper.trimString(imageLink, 'jpg');
          imageLink = Helper.trimString(imageLink, 'jpeg');
            setImage(imageLink);
        },
        [props.data.img]
    );

    return (
        <div className="CardContainer">
            <div className="CardImageContainer"><img src={image}/></div>
            <p className="">{props.data.name}</p>
        </div>
    );
}

export default Card;