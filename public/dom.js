const btns = document.querySelectorAll('.btn');
const span = document.querySelector('.state');
const submitBtn = document.querySelector('.submitBtn');
const distanceInput = document.querySelector('#distance');

let activity = 'running';
span.innerHTML = activity;

btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let siblings = e.target.parentNode.children;
        for(let i = 0; i< siblings.length; i++){
            if(siblings[i].classList.contains('active')){
                siblings[i].classList.remove('active');
            }
        }
        if(!e.target.classList.contains('active')){
            e.target.classList.add('active');
            let activeBtn = document.querySelector('.active');
            activity = activeBtn.dataset.activity;
            span.innerHTML = activity;
            update(data);
        } else {
            e.target.classList.remove('active');
        }
    })
})

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let distance = parseInt(distanceInput.value);
    let date = new Date().toString();
    console.log(distance, typeof distance);
    db.collection('activity').add({
        distance: distance,
        activity: activity,
        date: date
    });
    distanceInput.value = '';
})