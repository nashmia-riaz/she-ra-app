import { useEffect, useState } from "react";
import Helper from "../Helper";
import { useNavigate } from "react-router-dom";

function Card(props){   
    const [image, setImage] = useState('');
    const navigate = useNavigate();

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

    const LoadCard = (ID)=>{
        navigate(Helper.references.baseURL + `/Character/${props.data.name}`);
    }


    return (
        <div className="CardContainer" onClick={LoadCard}>
            <div className="CardImageContainer"><img src={image}/></div>
            <p className="">{props.data.name}</p>
        </div>
    );
}

export default Card;