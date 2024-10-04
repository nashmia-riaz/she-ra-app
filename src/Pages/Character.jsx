import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Character(){
    const location = useLocation();
    const {characterID} = location.state || {};

    console.log(characterID);

    useEffect(()=>{

    }, []);

    return(<div></div>);
}


export default Character;