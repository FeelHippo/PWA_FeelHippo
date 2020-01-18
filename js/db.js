//offline data
db.enablePersistence()
    .catch(err => {
        if (err.code == 'failed-precondition') {
            // probably multiple tabs open at once
            console.log('persistence failed');
            
        } else if (err.code == 'unimplemented') {
            // lack of browser support
            console.log('persistence is not available');
            
        }
    })


//real time listener
db.collection('sheet-music').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(change => {
        //console.log(change, change.doc.data(), change.doc.id);
        if(change.type === 'added') {
            // add sheet to DOM
            renderCard(change.doc.data(), change.doc.id)
        }
        if(change.type === 'removed') {
            // remove sheet from DOM
            removeCard(change.doc.id);
        }
    });
})

const form = document.querySelector('form');

form.addEventListener('submit', evt => {
    evt.preventDefault();

    const card = {
        title: form.title.value,
        description: form.details.value,
        sheet: ''
    }
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function() {
        try {
            card.sheet = await reader.result;            
                         
            db.collection('sheet-music').add(card)
            .catch(err => alert(err));
        
        } catch(err) {
            alert(err)
        }
    };
    form.title.value = '';
    form.details.value = '';
})

// delete cards, fullscreen sheet
const cardContainer = document.querySelector('.charts');
cardContainer.addEventListener('click', evt => {
    
    if(evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        db.collection('sheet-music').doc(id).delete();
    }

    if(evt.target.tagName === 'BUTTON') {
        const score = evt.target.getAttribute('data-sheet');
        displayFull(score);
    }

})

