import Sidebar from "./Sidebar";
import MainPage from "./MainPage";
import Logo from "../assets/She-Ra_and_The_Princesses_of_Power_Logo.png"
import "../App.css"

function Home(){
    return (
        <div>
        <img className="navbarLogo" src={Logo}></img>
            <div className="Container">
                <Sidebar></Sidebar>
                <MainPage></MainPage>
            </div>
        </div>
    );
}

export default Home;