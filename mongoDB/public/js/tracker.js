const submitForm = document.querySelector('#submit-form');


document.querySelectorAll('.tab').forEach(function(tab) {

    tab.addEventListener('click', function(event) {
        
        seeAssignments(event.target.dataset.session);
    })

})


submitForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = event.target.querySelector('#name').value;
    const link = event.target.querySelector('#link').value;
    const session = event.target.querySelector('#session').value;

    let existingAssigments = localStorage.getItem('assigments');

    if (!existingAssigments) {
        existingAssigments = [];
    } else {
        existingAssigments = JSON.parse(existingAssigments);
    }

    existingAssigments.push({
        name: name,
        link: link,
        session: session,
        time: (new Date()).toString()
    });

    localStorage.setItem('assigments', JSON.stringify(existingAssigments));

    seeAssignments(session);
    
});

function renderTable(assigments)
{

    const table = assigments.map(function(assigment) {
        return `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            ${assigment.name}
                        </th>
                        <td class="px-6 py-4">
                            ${assigment.link}
                        </td>
                        <td class="px-6 py-4">
                            ${assigment.time}
                        </td>
                    </tr>`;
    });

    document.querySelector('tbody').innerHTML = table.join("");
    
}

function seeAssignments(sessionNo) {

    let assigments = localStorage.getItem('assigments');
    assigments = JSON.parse(assigments);

    let sessionAssignments = assigments.filter(function(assigment) {
        return parseInt(assigment.session) === parseInt(sessionNo);
    })

    renderTable(sessionAssignments);

}

seeAssignments(1);