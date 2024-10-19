import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import parse from 'html-react-parser';
import Helper from "../Helper";
import React from "react";
import Logo from "../assets/She-Ra_and_The_Princesses_of_Power_Logo.png"

function Character(){
    const {id} = useParams();
    const [characterID, setCharacterID] = useState(id || {});
    const api = "https://she-raandtheprincessesofpower.fandom.com/api.php";
    const [characterInfo, setCharacterInfo] = useState(null);
    const [reactElements, setReactElements] = useState(React.createElement('div'));
    const [thumbnailLink, setThumbnailLink] = useState('');

    const fetchCharacter = async(ID) =>{
        try{
            const response = await axios.get(api,
                { params: {
                        action: 'parse',
                        page: ID,
                        format: 'json',
                        origin: '*',
                    }

                }
            );
            const result= await response.data;  
            setCharacterInfo(result.parse);    
            const parser = new DOMParser();
            const doc = parser.parseFromString(result.parse.text['*'], 'text/html');
            const infobox = doc.querySelector('.portable-infobox');
            
            console.log(infobox);
            var names = infobox.querySelector('[data-source="names"]');
            if(names){
                names = Helper.removeHtmlTags(names); 
                names = Helper.trimBrackets(names);
            }
            var skills = doc.querySelector('[data-source="skills"]');
            if(skills){skills = Helper.removeHtmlTags(skills); 
            skills = Helper.trimBrackets(skills); }
            var occupation = doc.querySelector('[data-source="occupation"]');
            if(occupation){occupation = Helper.removeHtmlTags(occupation); 
            occupation = Helper.trimBrackets(occupation); }
            var species = doc.querySelector('[data-source="species"]');
            if(species){
            species = Helper.removeHtmlTags(species); 
            species = Helper.trimBrackets(species); }
            var gender = doc.querySelector('[data-source="gender"]');
            if(gender){
            gender = Helper.removeHtmlTags(gender); 
            gender = Helper.trimBrackets(gender); }
            var birthday = doc.querySelector('[data-source="birthday"]');
            if(birthday){
            birthday = Helper.removeHtmlTags(birthday); 
            birthday = Helper.trimBrackets(birthday); }
            var runestone = doc.querySelector('[data-source="runestone"]');
            if(runestone){
                runestone = Helper.removeHtmlTags(runestone); 
                runestone = Helper.trimBrackets(runestone); 
            }

            setReactElements({names: names, skills: skills, occupation: occupation, species: species, gender: gender, birthday: birthday, runestone: runestone});
            // setReactElements(doc.querySelector('.portable-infobox').outerHTML);

            const thumbnailResponse = await axios.get(api, {
                params: {
                    action: 'query',
                    titles: ID,
                    prop: 'pageimages',
                    pithumbsize: '1000',
                    format: 'json',
                    origin: '*',
                }
            });
            console.log(thumbnailResponse);
            const pageID = Object.keys(thumbnailResponse.data.query.pages)[0];
            var imageLink = Helper.trimString(thumbnailResponse.data.query.pages[pageID].thumbnail.source, 'png');
            imageLink = Helper.trimString(imageLink, 'PNG');
            imageLink = Helper.trimString(imageLink, 'gif');
            imageLink = Helper.trimString(imageLink, 'jpg');
            imageLink = Helper.trimString(imageLink, 'jpeg');
            setThumbnailLink(imageLink);
        } catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        if(characterID)
            fetchCharacter(characterID);
    }, [characterID]);

    return(<div>
        {(characterInfo) &&
        <div>
            <img className="navbarLogo" src={Logo}></img>
            <h1>{characterInfo.title}</h1>
            <div className='characterContainer'>
                <div className="characterImage">
                    <img src={Helper.trimString(thumbnailLink)} alt="" />
                </div>
                <div className="characterInfo">
                    {(reactElements.birthday) ? <section>{parse(reactElements.birthday.outerHTML)}</section> : <div><h3>Birthday</h3><p>Unknown</p></div> }
                    {reactElements.gender ? <section>{parse(reactElements.gender.outerHTML)}</section> : <div><h3>Gender</h3><p>Unknown</p></div>}
                    {reactElements.species  ? <section>{parse(reactElements.species.outerHTML)}</section> : <div><h3>Species</h3><p>Unknown</p></div>}
                </div>
            </div>
            <div className="characterSectionsContainer">
                {reactElements.names ? <div>
                {parse(reactElements.names.outerHTML)}
                </div> : <div><h3>Names</h3><p>Unknown</p></div>}
                {reactElements.occupation ? <div>
                {parse(reactElements.occupation.outerHTML)}</div>: <div><h3>Occupation</h3><p>Unknown</p></div>}
                {reactElements.skills ? <div>
                {parse(reactElements.skills.outerHTML)}</div> : <div><h3>Skills</h3><p>Unknown</p></div>}
                {reactElements.runestone ? <div>
                {parse(reactElements.runestone.outerHTML)}
                </div> : <div><h3>Runestone</h3><p>Unknown</p></div>}
            </div>
            {/* {parse(reactElements)} */}
        </div>}
    </div>);
}


export default Character;