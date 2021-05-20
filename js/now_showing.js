const main = () => {
    const movie_list = document.querySelector('.movie-list');
    const paginate = document.querySelector('.pagination');
    const genre = document.querySelector('#genre');
    const IMAGE_BASE_URL =  'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
    let movie_arr = [];

    // event listner
    document.addEventListener("DOMContentLoaded", ()=>{
        
        const END_POINT = 'https://api.themoviedb.org/3/movie/now_playing?api_key=3d54c2c273efcecb7f962f14b15feebd&language=en-US&page=1';
        const END_POINT_G = 'https://api.themoviedb.org/3/genre/movie/list?api_key=3d54c2c273efcecb7f962f14b15feebd&language=en-US'
        
        // fetch genres
        fetch(END_POINT_G)
        .then((res)=>{
            res.json()
            .then((data)=>{
                console.log(data);                
                genre.innerHTML = displayGenres(data.genres);
           })
            .catch(err=>console.log("Error Occurred"))
        })
        .catch(err=>console.log("Error Occurred"));

        // fetch now playing movies
        fetch(END_POINT)
        .then((res)=>{
            res.json()
            .then((data)=>{
                // console.log(data);
                                
                movie_arr = data.results;
                
                displayMovies(data.results);
                
                let pages = getPages(data.page, data.total_pages);

                paginate.innerHTML = `<a href="#" class="page-number prev"><i class="fa fa-angle-left"></i></a>${pages}<a href="#" class="page-number next"><i class="fa fa-angle-right"></i></a>`;
            })
            .catch(err=>console.log("Error Occurred"))
        })
        .catch(err=>console.log("Error Occurred"));

    })
    
    genre.addEventListener('change', (e) => {
        let genres;
        let genre_movies = [];
        option = genre.options[genre.selectedIndex].value;
        if(option != 'all'){
            
            for(let i=0; i<movie_arr.length; i++){
                genres = movie_arr[i].genre_ids;
                
                for(let g=0; g<genres.length; g++){
                    if(option == genres[g]){
                        genre_movies.push(movie_arr[i]);
                    }
                } 
            }
            
            movie_arr = [];

            for(let i=0; i<genre_movies.length; i++){
                movie_arr.push(genre_movies[i])
            }
            
            console.log(movie_arr);
        }
        
        displayMovies(movie_arr);
        
    })

    movie_list.addEventListener('click', (e)=>{
        e.preventDefault();

        let clickedEl = e.target.id;

        if(! clickedEl){
            return;
        }
        
        for(let i = 0; i < movie_arr.length;i++){
            if(clickedEl == movie_arr[i].id){
                // store object in session storage
                sessionStorage.setItem("movie", JSON.stringify(movie_arr[i]))
                // fetch movie trailer
                const END_POINT_TRAILER = `https://api.themoviedb.org/3/movie/${movie_arr[i].id}/videos?api_key=3d54c2c273efcecb7f962f14b15feebd&language=en-US`;

                fetch(END_POINT_TRAILER)
                .then((res)=>{
                    res.json()
                    .then((data)=>{
                        sessionStorage.setItem("movie_trailer", JSON.stringify(data.results))
                    })
                    .catch(err=>console.log("Error Occurred"))
                })
                .catch(err=>console.log("Error Occurred"));

                // get movie actors
                const END_POINT_CREDITS = `https://api.themoviedb.org/3/movie/${movie_arr[i].id}/credits?api_key=3d54c2c273efcecb7f962f14b15feebd&language=en-US`;
                // console.log(END_POINT_CREDITS);
                fetch(END_POINT_CREDITS)
                .then((res)=>{
                    res.json()
                    .then((data)=>{
                        // console.log(data.cast)
                        // console.log(data.crew)
                        sessionStorage.setItem("movie_cast", JSON.stringify(data.cast));
                        sessionStorage.setItem("movie_crew", JSON.stringify(data.crew));
                        location.href="single.html";
                    })
                    .catch(err=>console.log("Error Occurred"))
                })
                .catch(err=>console.log("Error Occurred"));
                
            }
        }    
    })
    
    paginate.addEventListener('click', (e)=>{
        e.preventDefault();

        let page = e.target.id;

        if(! page){
            return;
        }

        const END_POINT = `https://api.themoviedb.org/3/movie/now_playing?api_key=3d54c2c273efcecb7f962f14b15feebd&language=en-US&page=${page}`;

        fetch(END_POINT)
        .then((res)=>{
            res.json()
            .then((data)=>{
                console.log(data);
                
                movie_arr = data.results;
                
                displayMovies(data.results);
                
                let pages = getPages(data.page, data.total_pages);

                paginate.innerHTML = `<a href="#" class="page-number prev"><i class="fa fa-angle-left"></i></a>${pages}<a href="#" class="page-number next"><i class="fa fa-angle-right"></i></a>`;
            })
            .catch(err=>console.log("Error Occurred"))
        })
        .catch(err=>console.log("Error Occurred"));
    });

    const getPages = (current_page, total_pages) => {
        let page = "";
        for(let i=current_page; i<total_pages; i++){

            // show first X pages
            first_x_pages = current_page + 3
            // show last X pages
            last_x_pages = total_pages - 3
            if(i < first_x_pages || i > last_x_pages){
                if(i == current_page){
                    page += `<span class="page-number current" id="${i}">${i}</span>`;
                    continue;
                }
                page += `<span class="page-number" id="${i}">${i}</span>`
            }
            // else if((total_pages - current_page) < 5){
            //     i = 1;
            //     page += `<span class="page-number current" id="${i}">${i}</span>`;
            //     i = current_page;
            //     page += `<span class="page-number current" id="${i}">${i}</span>`;
            // }
            // else if(i == current_page + first_x_pages){
            //     page += `<span class="page-number">..</span>`;
            // }
        }

        return page;
    }

    const displayMovies = (movies) => {
        let populateContent = '';
        movies.forEach(movie => {
            populateContent += 
            `<div class="movie">
                <figure class="movie-poster"><img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="#" id="${movie.id}"></figure>
                <div class="movie-title"><a href="#">${movie.title}</a></div>
                <p class="module fade">${movie.overview}</p>
            </div>`
        });
        // console.log(populateContent);
        if(!populateContent){
            populateContent= `<h2>No Movies found</h2>`
        }
        movie_list.innerHTML = populateContent
        // return populateContent
    }

    const displayGenres = (genres) => {
        let populateContent = '';
        genres.forEach(genre => {
            populateContent += 
            `<option value="${genre.id}">${genre.name}</option>`
        });
        return `<option value="all">All</option>${populateContent}`
    }

}

main();