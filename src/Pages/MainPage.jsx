import Card from "./Card";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

function MainPage(){
    const api = "https://she-raandtheprincessesofpower.fandom.com/api.php";
    const [characters, setCharacters] = useState([]);
    const [currentCharacters, setCurrentCharacters] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;
    const [pageCount, setPageCount]=useState(0);

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
                        
                        fetchIndividualCharacter(element.pageid);
                    });
                }

            } catch(error){
                console.log(error);
            }
        }

        fetchCharacters();
    }, [api]);

    useEffect(()=>{
        if(currentPage + itemsPerPage < characters.length){
            setCurrentCharacters(characters.slice(currentPage, currentPage + itemsPerPage));
        }
        if(characters.length > 0)
            setPageCount(characters.length / itemsPerPage);
    }, [characters]);

    const handlePageChange = (data)=>{
        setCurrentPage(data.selected);
        const firstIndex = (data.selected) * itemsPerPage;
        var lastIndex = firstIndex + itemsPerPage;
        if(lastIndex > characters.length) lastIndex = characters.length;
        setCurrentCharacters(characters.slice(firstIndex, lastIndex));
    }

    const imageURL = "https://static.wikia.nocookie.net/shera-and-the-princesses-of-power/images/a/a6/Scorpia%27s_grandfather_mural_closeup.png/revision/latest/scale-to-width-down/500?cb=20230616021000";
    return(<div className="MainPage">
        {currentCharacters.map((character) => {
            return <Card className="CharacterCard" key={character.pageid} data={{img: character.src, name: character.title}}/>
        })}
        <ReactPaginate
            className="pagination justify-content-center my-4 gap-4"
            nextLabel="Next"
            previousLabel="Prev"
            previousClassName="btn btn-primary fs-5 prev"
            nextClassName="btn btn-primary fs-5 next"
            activeClassName="active"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            
            forcePage={0}
            marginPagesDisplayed={1}
            pageRangeDisplayed={1}
            pageCount={pageCount}
            onPageChange={handlePageChange}
        />
    </div>); 
}
export default MainPage;