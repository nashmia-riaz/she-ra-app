import Card from "./Card";
import { useEffect, useState } from "react";
import axios, { all } from "axios";
import ReactPaginate from "react-paginate";

function MainPage(){
    const api = "https://she-raandtheprincessesofpower.fandom.com/api.php";
    const [allcharacters, setAllCharacters] = useState([]);
    const [charactersTemp, setCharactersTemp] = useState([]);
    const [pageCharacters, setCurrentCharacters] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;
    const [pageCount, setPageCount]=useState(0);
    const [searchTerm, SetSearchTerm] = useState('');

    const addCharacter = (src, id)=>{
        setAllCharacters((prevCharacters)=>{
            [...prevCharacters].forEach(element=>{
                if(element.pageid === id){
                    element.src = src;
                }
            });
            return [...prevCharacters];
        });
    } 
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
                setAllCharacters(result.query.categorymembers);
                setCharactersTemp(result.query.categorymembers);
                result.query.categorymembers.forEach(element => {
                    fetchIndividualCharacter(element.pageid);
                });
            }

        } catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        console.log('starting page');
        setAllCharacters([]);
        fetchCharacters();
    }, [api]);

    useEffect(()=>{
        resetCurrentCharacters(allcharacters);
    }, [allcharacters]);

    const resetCurrentCharacters = (characters)=>{
        if(currentPage + itemsPerPage < characters.length){
            setCurrentCharacters(characters.slice(currentPage, currentPage + itemsPerPage));
        }else setCurrentCharacters(characters);
        if(characters.length > 0)
            setPageCount(characters.length / itemsPerPage);        
    }

    const handlePageChange = (data)=>{
        setCurrentPage(data.selected);
        const firstIndex = (data.selected) * itemsPerPage;
        var lastIndex = firstIndex + itemsPerPage;
        if(lastIndex > charactersTemp.length) lastIndex = charactersTemp.length;
        setCurrentCharacters(charactersTemp.slice(firstIndex, lastIndex));
    }

    const SearchCharacter = (characterSearchTerm)=>{
        SetSearchTerm(characterSearchTerm);
        if(characterSearchTerm === ""){
            setCharactersTemp(allcharacters);
            resetCurrentCharacters(allcharacters);
            return;
        }
        
        const filteredPages = allcharacters.filter((character)=>{
            return character.title.toLowerCase().includes(characterSearchTerm.toLowerCase());
        });

        setCharactersTemp(filteredPages);
        resetCurrentCharacters(filteredPages);
    }

    return(
    <div>
        <input type="text" placeholder="Search" value={searchTerm} name="searchInput" className="searchInput" onChange={(event)=>SearchCharacter(event.target.value)}/><div className="MainPage">
        {pageCharacters.map((character) => {
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
    </div>
    </div>); 
}
export default MainPage;