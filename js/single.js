const main = () =>{
    const title = document.querySelector('title');
    const view_movie = document.querySelector('.content > .row');
    const breadcrumb_title = document.querySelector('.breadcrumbs span');

    document.addEventListener("DOMContentLoaded", ()=>{
        if(!sessionStorage.getItem("movie"))
        {
            location.href="now_showing.html";
        }
        
        const movie_data = JSON.parse(sessionStorage.getItem("movie"));
        title.innerHTML = `Now Showing | ${movie_data.title}`;
        breadcrumb_title.innerHTML = movie_data.title
        // console.log(movie_data);
        
        const IMAGE_BASE_URL =  'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
        let populateContent = '';
        
        const date = new Date(movie_data.release_date)
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }) 
        const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(date ) 

        const movie_trailer = JSON.parse(sessionStorage.getItem("movie_trailer"));
        const movie_casts = JSON.parse(sessionStorage.getItem("movie_cast"));
        const movie_crew = JSON.parse(sessionStorage.getItem("movie_crew"));
        let actors = "";
        movie_casts.forEach((actor, index) => {
            if(index < 3 && index != 2){
                actors += `${actor.name}, `
            }
            else if(index == 2){
                actors += `${actor.name}`
            }
        })
        let writers = "";
        let directors = "";
        let writer_count = 0;
        
        movie_crew.forEach((crew, index) => {
            if(crew.department == 'Directing' && crew.job == 'Director'){
                directors += `${crew.name}`;
            }
            if(crew.department == 'Writing' && crew.job == 'Screenplay'){
                if(writer_count < 2 && writer_count != 1){
                    writers += `${crew.name}(${crew.job}), `
                }
                
                if(writer_count == 1){
                    writers += `${crew.name}(${crew.job})`;
                }
                writer_count++
            }

            
            
        })
        // console.log(directors)

        populateContent = 
        `<div class="col-md-6">
            <!--<figure class="movie-poster"><img src="${IMAGE_BASE_URL}${movie_data.backdrop_path}" alt="${movie_data.title}"></figure>-->
            <figure class="movie-poster"><img src="${IMAGE_BASE_URL}${movie_data.poster_path}" alt="${movie_data.title}"></figure>
        </div>
        <div class="col-md-6">
            <h2 class="movie-title">${movie_data.title}</h2>
            <div class="movie-summary">
                <p>${movie_data.overview}</p>
            </div>
            <ul class="movie-meta">
                <li><strong>Rating:</strong> 
                    <div class="star-rating" title="Rated 4.00 out of 5"><span style="width:80%"><strong class="rating">4.00</strong> out of 5</span></div>
                </li>
                <li><strong>Length:</strong> 98 min</li>
                <li><strong>Premiere:</strong> ${day} ${month} ${year }</li>
                <li><strong>Category:</strong> Animation/Adventure/Comedy</li>
            </ul>

            <ul class="starring">
                <li><strong>Directors:</strong> ${directors}</li>
                <li><strong>Writers:</strong> ${writers}</li>
                <li><strong>Stars:</strong> ${actors}</li>
            </ul>
            <div class="row">
                <div class="col-md-12 youtube-container">
                    <iframe width="95%" height="300px" src="https://www.youtube.com/embed/${movie_trailer[0].key}" frameborder="0" allow="accelerometer; autoplay; 
                    encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>
                </div>
            </div>
        </div>`

        view_movie.innerHTML=populateContent;
    });
}

main()

