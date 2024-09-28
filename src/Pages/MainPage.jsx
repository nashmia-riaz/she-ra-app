import Card from "./Card";
import { useEffect, useState } from "react";
import axios from "axios";

function MainPage(){
    const api = "https://she-raandtheprincessesofpower.fandom.com/api.php";
    const [characters, setCharacters] = useState([]);
    const addCharacter = (src, id)=>{
        setCharacters((prevCharacters)=>{
            [...prevCharacters].forEach(element=>{
                if(element.pageid === id){
                    element.src = src;
                }
            });
            return [...prevCharacters];
        });
    } 

    useEffect(()=>{
        console.log('starting page');
        setCharacters([]);
        const fetchIndividualCharacter = async(characterID)=>{
            try{
                const response = await axios.get(api,
                    { 
                        params: {
                            action: 'query',
                            prop: 'pageimages',
                            pithumbsize: '500',
                            format: 'json',
                            pageids: characterID,
                            origin: '*'
                        }
                    }
                );
                
                addCharacter(response.data.query.pages[`${characterID}`].thumbnail.source, characterID);
            }
            catch(error){ console.log(error); }
        }

        const fetchCharacters = async() =>{
            try{
                const response = await axios.get(api,
                    { params: {
                            action: 'query',
                            list: 'categorymembers',
                            cmtitle: 'Category:Characters',
                            cmlimit: '500',
                            format: 'json',
                            cmnamespace: '0',
                            origin: '*'
                        }

                    }
                );
                const result= await response.data;
                if(result.query.categorymembers){
                    setCharacters(result.query.categorymembers);
                    result.query.categorymembers.forEach(element => {
                        
                    if(element.title === 'Serenia') console.log(element.pageid); 
                        fetchIndividualCharacter(element.pageid);
                    });
                }

            } catch(error){
                console.log(error);
            }
        }

        fetchCharacters();
    }, [api]);

    const imageURL = "https://static.wikia.nocookie.net/shera-and-the-princesses-of-power/images/a/a6/Scorpia%27s_grandfather_mural_closeup.png/revision/latest/scale-to-width-down/500?cb=20230616021000";
    return(<div className="MainPage">
        {characters.map((character) => {
            return <Card className="CharacterCard" key={character.pageid} data={{img: character.src, name: character.title}}/>
        })}
    </div>); 
}
export default MainPage;