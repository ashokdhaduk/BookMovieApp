import React, { useEffect, useState } from 'react';
import './Home.css';
import { ImageList, ImageListItem, ImageListItemBar, Select } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { FormControl, InputLabel, Input, Checkbox, ListItemText, MenuItem, TextField } from '@material-ui/core';
import {Link} from 'react-router-dom';

//style used for displaying upcoming movies
const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: "nowrap",
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: "translateZ(0)",
    },
    title: {
      color: 'white',
    },
    titleBar: {
      background: "rgba(0,0,0,0.5)",
    },
  }));
  
  //style used for displaying released movies
  const useStylesReleased = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      backgroundColor: theme.palette.background.paper,
      margin:"16px",
      width:"76%",
    },
    title: {
      color: 'white',
    },
    release_date: {
        color: theme.palette.primary.light,
      },
    titleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    }
  }));

  //style used for displaying filter card
  const useFilterStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
        maxWidth: 200,
      },
    root: {
      minWidth: 240,
      maxWidth: 240,
      margin: theme.spacing(1),
      textAlign: 'center',
    },
    title: {
      fontSize: 14,
      color: theme.palette.primary.light
    },
    pos: {
      marginBottom: 15,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
      },
}));

//style for designing the selct dropdowns of filter
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
        width: 240
        }
    }
};


export default function Home(props){
    const [tileData, setTileData] = useState([]);       
    const [releasedMovies, setReleasedMovies] = useState([]);
    const [getGenres, setGenres] = useState([]);
    const [genreNames, setGenreNames] = useState([]);
    const [getArtists, setArtists] = useState([]);
    const [artistNames, setArtistNames] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

    let filters = {
        movieName: '',
        genreName: {},
        artistName: {},
        releaseStartDate: '',
        releaseEndDate: ''
    }

    useEffect(()=>{
        loadMovies();
        loadReleasedMovies();
        loadGenres();
        loadArtists();
    },[])
    
    //function for loading all the upcoming movies from the API
    const loadMovies = async()=> {

        try{
            const input = await fetch("http://localhost:8085/api/v1/movies?limit=50");
            
            const data = await input.json();
        
            const filteredMovies = data.movies.filter((items)=>{
                return items.status.indexOf("PUBLISHED") > -1
            }); 
            
            setTileData(filteredMovies);
        }
        catch(e){
            alert(`Error: ${e.message}`);
        }
    }
    
    //function for loading all the released movies from the API
    const loadReleasedMovies = async()=> {
        try{
            const response = await fetch("http://localhost:8085/api/v1/movies?limit=50",{
                method: 'GET',
                withCredentials: true,
                header: new Headers({
                    'Content-Type': 'application/json',
                }),
            });
            const responseData = await response.json();

            const filteredMovies = responseData.movies.filter((items)=>{
                return items.status.indexOf("RELEASED") > -1
            }); 
            setReleasedMovies(filteredMovies);
        }
        catch(e){
            alert(`Error: ${e.message}`);
        }
    }

    //function for loading genres in the select dropdown from the API
    const loadGenres = async()=> {
        try{
            const input = await fetch("http://localhost:8085/api/v1/genres",{
                method: 'GET',
                withCredentials: true,
                header: new Headers({
                    'Content-Type': 'application/json'
                }),
            });
            const data = await input.json();
        
            setGenres(data.genres);
        }
        catch(e){
            alert(`Error: ${e.message}`);
        }
    }

    //function for loading artists in the select dropdown from the API
    const loadArtists = async()=> {
        try{
            const input = await fetch("http://localhost:8085/api/v1/artists",{
                method: 'GET',
                withCredentials: true,
                header: new Headers({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }),
            });
            const data = await input.json();
        
            setArtists(data.artists);
        }
        catch(e){
            alert(`Error: ${e.message}`);
        }
    }
    
    //function for displaying upcoming movies in the Grid
    const DisplayMovies = () =>{
        const classes = useStyles();
        
        return(
            <div className={classes.root}>
                    <ImageList className={classes.gridList} cols={6} rowHeight={250}>
                        {tileData.map((tile) => (
                        <ImageListItem key={tile.poster_url}>
                            <img src={tile.poster_url} alt={tile.title} />
                            <ImageListItemBar
                            title={tile.title}                        
                            classes={{
                                root: classes.titleBar,
                                title: classes.title,
                            }}
                            />
                        </ImageListItem>
                        ))}  
                    </ImageList>
            </div>
        )
    }

    //function for displaying released movies in the Grid
    const DisplayTheatreMovies = ()=> {
        const classes = useStylesReleased();
        const isFilteredMoviesAvailable = filteredItems.length > 0;
        const loopOverArray = isFilteredMoviesAvailable ? [...filteredItems] : [...releasedMovies];
        return(
            <div className={classes.root}>
                    <ImageList 
                        cols={4}
                        rowHeight={350}
                        className={classes.gridList}
                        gap={16}
                        >
                        {loopOverArray.map((tile) => (
                        
                            <ImageListItem key={tile.poster_url} style={{width:210}}>
                                <Link to={{
                                    pathname:`/movie/${tile.id}`,
                                    state: {
                                        movie: tile,
                                    }
                                    }}>
                                    <img src={tile.poster_url} alt={tile.title} style={{cursor:'pointer', height:'100%', width:'100%'}}/>
                                    <ImageListItemBar
                                        title={tile.title}  
                                        subtitle= {<span>Release Date: {(Date(tile.release_date))}</span>}
                                        classes={{
                                            root: classes.titleBar,
                                            title: classes.title
                                        }}
                                    />
                                </Link>
                            </ImageListItem>
                        
                        ))}  
                    </ImageList>
            </div>
        )
    }

    //function to handle change in the select dropdown of genres in the filter card
    const handleGenreChange = event => {
        setGenreNames(event.target.value);
    }

    //function to handle change in the select dropdown of artists in the filter card
    const handleArtistChange = (event) => {
        setArtistNames(event.target.value);
    }

    //function to handle change in the movie name text field in the filter card
    const handleInputChange = (e)=>{
        filters.movieName = e.target.value;
    }

    //function to handle change in the release start date in the filter card
    const handleStartDate = (e) =>{
        filters.releaseStartDate = e.target.value;
    }

    //function to handle change in the release end date in the filter card
    const handleEndDate = (e) => {
        filters.releaseEndDate = e.target.value;
    }

    //function for handling the click of Apply button in the filter card
    function filterHandler() {
        let filteredItems = releasedMovies.slice();
        let result = [];

        //filtering with the movie name
        if(filters.movieName !== "")
            filteredItems = filteredItems.filter(item => item.title.toLocaleLowerCase() === filters.movieName.toLocaleLowerCase())
        
        //filtering with the genre names
        if(filters.genreName !== {}){
            let genreFilter = [];
            filteredItems.filter(item => {
                
                const genreList = item.genres;

                return genreList.map(eachGenre => {
                    return genreNames.forEach((genre)=>{
                        if(genre === eachGenre && !genreFilter.includes(item)){
                            genreFilter.push(item);
                        }                        
                    })                    
                })           
            })
            if(result.length > 0 && genreFilter.length !== 0){
                const temp =result.slice();
                temp.forEach(item => {
                    if(!genreFilter.includes(item)){
                        const index = result.indexOf(item);
                        if(index > -1){
                            result.splice(index, 1);
                        }   
                    }   
                    filteredItems = result; 
                })
                
            }
            else if(genreFilter.length >0){
                filteredItems = genreFilter;
                result = genreFilter;
            }
        }

        //filtering with the artist names
        if(filters.artistName !== {}){
            let artistFilter = [];
            filteredItems.filter(item => {
                
                const artistList = item.artists;
               
                return artistList.map(eachArtist => {
                    return artistNames.forEach((artist)=>{
                        if(artist === (eachArtist.first_name + " " + eachArtist.last_name) && !artistFilter.includes(item)){
                            
                            artistFilter.push(item);
                        }
                    })
                })
            })
            if(result.length > 0 && artistFilter.length !== 0){
                const temp =result.slice();
                temp.forEach(item => {
                    if(!artistFilter.includes(item)){
                        const index = result.indexOf(item);
                        if(index > -1){
                            result.splice(index, 1);
                        }   
                    }   
                    filteredItems = result; 
                })
                
            }
            else if(artistFilter.length >0){
                filteredItems = artistFilter;
                result = artistFilter;
            }

        }

        //filtering with the start date
        if(filters.releaseStartDate !== ''){
            const d1 = new Date(filters.releaseStartDate);
            filteredItems.filter(item => {
                const d2 = new Date(item.release_date);
                if(+d2 >= +d1 && !result.includes(item)){
                    result.push(item);
                }
                return filteredItems;
            })
            if(result.length > 0)
                filteredItems = result;
        }

        //filtering with the end date
        if(filters.releaseEndDate !== ''){
            const d1 = new Date(filters.releaseEndDate);
            filteredItems.filter(item => {
                const d2 = new Date(item.release_date);
                if(+d1 >= +d2 && !result.includes(item)){
                    result.push(item);
                }
                return filteredItems;
            })
            if(result.length > 0)
                filteredItems = result;
        }

        //showing all the records again, if nothing is selected/written in the filter fields
        if(filters.movieName === "" && genreNames.length === 0 && artistNames.length === 0 && filters.releaseStartDate === '' && filters.releaseEndDate === ''){
            loadReleasedMovies();
            filteredItems = releasedMovies;
        }

        setFilteredItems(filteredItems);
    }


    //function to display the filter form 
    const DisplayFilter = () => {
        const classes = useFilterStyles();
        return(
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                    FIND MOVIES BY:
                    </Typography>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="movie-name">Movie Name</InputLabel>
                        <Input onChange={handleInputChange} id="movie-name" aria-describedby="movie-name"/>
                    </FormControl>
                    
                    <FormControl className={classes.formControl}>
                        <InputLabel id="genre-names">Genres</InputLabel>
                        <Select
                        labelId="genre-names"
                        id="genre-checkboxes"
                        multiple
                        value={genreNames}
                        onChange={handleGenreChange}
                        input={<Input />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                        >
                        {getGenres.map((name) => (
                            <MenuItem key={name.id} value={name.genre}>
                            <Checkbox checked={getGenres.indexOf(name.genre) > -1} />
                            <ListItemText primary={name.genre} />
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-mutiple-checkbox-label">Artists</InputLabel>
                        <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={artistNames}
                        onChange={handleArtistChange}
                        input={<Input />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                        >
                        {getArtists.map((name) => (
                            <MenuItem key={name.id} value={name.first_name + " " + name.last_name}>
                            <Checkbox checked={getArtists.indexOf(name.first_name) > -1} />
                            <ListItemText primary={name.first_name + " " + name.last_name} />
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>

                    <TextField
                            id="release_date_start"
                            label="Release Date Start"
                            type="date"
                            defaultValue="yyyy-MM-dd"
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            margin= 'normal'
                            onChange = {handleStartDate}
                        /> 
                    
                    <TextField
                            id="release_date_end"
                            label="Release Date End"
                            type="date"
                            defaultValue="yyyy-MM-dd"
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            margin= 'normal'
                            onChange = {handleEndDate}
                        /> 

                </CardContent>
                <CardActions>
                    <Button onClick={filterHandler} size="large" style={{background: "#166596", color: "#fff", width: "220px", textAlign:"center"}}>APPLY</Button>
                </CardActions>
            </Card>
        )
    }

    return(
        <div>
             <div className="homeHeading">
                Upcoming Movies
             </div>

             <DisplayMovies/>

             <div className="flex-container">
                <div className="released-movies-container"><DisplayTheatreMovies/></div>
                <div className="filter-container">
                    <DisplayFilter />
                </div>
             </div>

        </div>
    )
}
