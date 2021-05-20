const main = () =>{
    const slides = document.querySelectorAll('.slides img');
    const latest_right = document.querySelectorAll('.latest-bg');
    const latest_bottom = document.querySelectorAll('.latest-bt-bg');
    const loaders = document.querySelectorAll('.loader');
    

    document.addEventListener("DOMContentLoaded", ()=>{
        const END_POINT = 'https://api.themoviedb.org/3/movie/upcoming?api_key=3d54c2c273efcecb7f962f14b15feebd&language=en-US&page=1';

        fetch(END_POINT)
        .then((res)=>{
            res.json()
            .then((data)=>{
                // console.log(data);
                // data.results.array.forEach(element => {
                    
                // });
                let populateContent = '';
                const IMAGE_BASE_URL =  'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
                for(let i=0; i<3; i++){
                    slides[i].setAttribute('src',`${IMAGE_BASE_URL}${data.results[i].poster_path}`);
                }
                for(let i=3; i<5; i++){
                    latest_right[i-3].style.cssText =`background: url('${IMAGE_BASE_URL}${data.results[i].poster_path}') center bottom / cover no-repeat`;
                    loaders[i-3].classList.remove('animate-loader');
                    loaders[i-3].classList.add('animate__animated', 'animate__fadeOut');
                }
                for(let i=5; i<9; i++){
                    // latest_bottom[i-5].setAttribute('src',`${IMAGE_BASE_URL}${data.results[i].poster_path}`);
                    latest_bottom[i-5].style.cssText =`background: url('${IMAGE_BASE_URL}${data.results[i].poster_path}') center bottom / cover no-repeat`;
                    loaders[i-3].classList.remove('animate-loader');
                    loaders[i-3].classList.add('animate__animated', 'animate__fadeOut');
                }
            })
            .catch(err=>console.log("Error Occurred"))
        })
        .catch(err=>console.log("Error Occurred"));
        
        
    });
}

main()

