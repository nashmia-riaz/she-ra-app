function trimString(str, match){
    if(!str) return str;
    const index = str.indexOf(match);
    return index !== -1 ? str.substring(0, index+match.length) : str;
}

export default {trimString};