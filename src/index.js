document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');

    
    fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(data => {
            
            const renderPup = (pup) => {
                const pupSpan = document.createElement('span');
                pupSpan.textContent = pup.name;
                pupSpan.addEventListener('click', () => displayPupInfo(pup));
                dogBar.appendChild(pupSpan);
            };

            
            const displayPupInfo = (pup) => {
                dogInfo.innerHTML = `
                    <img src="${pup.image}" />
                    <h2>${pup.name}</h2>
                    <button>${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
                `;

                
                const toggleButton = dogInfo.querySelector('button');
                toggleButton.addEventListener('click', () => toggleGoodDog(pup));
            };

            
            const toggleGoodDog = (pup) => {
                pup.isGoodDog = !pup.isGoodDog;
                fetch(`http://localhost:3000/pups/${pup.id}`, {
                    method: 'PATCH',
                    headers: {
                        'ContentType' : 'application/json'
                    },
                    body: JSON.stringify({ isGoodDog: pup.isGoodDog})
                })
                .then(() => {
                    
                    const toggleButton = dogInfo.querySelector('button');
                    toggleButton.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';

                })
                .catch(error => console.error('Error toggling good dog status:', error));
            };

            
            const renderAllPups = () => {
                dogBar.innerHTML = '';
                data.forEach(pup => renderPup(pup));
            };

            
            renderAllPups();

            
            filterButton.addEventListener('click', () => {
                const filterText = filterButton.textContent;
                if (filterText.includes('OFF')) {
                    filterButton.textContent = 'Filter good dogs: ON';
                    renderAllPups();

                } else {
                    filterButton.textContent = 'Filter good dogs: OFF';
                    renderAllPups();
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});