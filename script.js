/*Variables
Using jquery syntax > storing elements (that will be used multiple times) by -id or class- on variables
to facilitate the call of events and functions .*/
const contactsMenuOption = $("#contactsMenuOption"); //"Contacts" element option on the Menu
const contactsListElement = $("#contactsList"); //"ul" element containg the contact cards (data) to display
const searchMenuOption = $("#searchMenuOption"); //"Search" element option on the Menu
let searchInput = $("#searchInput"); // "Search input" element
let addContactMenuOption = $("#addContactMenuOption"); // "Add" element option on the Menu > will opens the modal
let modal = $("#addContactModal"); // "Modal" element
const modalForm = $("#modalForm"); // Form element
const aboutMenuOption = $("#aboutMenuOption") // "About" element option on the Menu
const about = $(".about"); // "About" element content


//Class Contact will contain objects with the contact properties (id, name, number, address) and the getters and setters for them.
class Contact {
    constructor({ id, firstName, lastName, phoneNumber, address } = {}){
        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._phoneNumber = phoneNumber;
        this._address = address;
    }
    get id(){
        return this._id;
    }
    get firstName(){
        return this._firstName;
    }
    get lastName(){
        return this._lastName;
    }
    get phoneNumber(){
        return this._phoneNumber;
    }
    get address(){
        return this._address;
    }
    set id(newId){
        this._id = newId;
    }
    set firstName(newfirstName){
        this._firstName = newfirstName;
    }
    set lastName(newLastName){
        this._lastName = newLastName;
    }
    set phoneNumber(newPhoneNumber){
        this._phoneNumber = newPhoneNumber;
    }
    set address(newAddress){
        this._address = newAddress;
    }
}

//Class ContactBook will contain an array of objects (contacts), will have methods : Add, Search, Remove
class ContactBook {
    static identificator = 0; // to assign a unique identifier to every contact

    constructor(contacts = []){
        this._contacts = [];
        for(const contact of contacts) {
            this.addContact(contact);
        }
    }
    get contacts() {
        return this._contacts;
    }
    /*addContact will add new contact to the array of contacts, will assign a unique id to it */
    addContact(newContact) {
        ContactBook.identificator = ContactBook.identificator + 1;
        newContact.id = ContactBook.identificator;
        this._contacts.push(newContact);
    }
    /*searchContact will return an array filtered with the values found for the string provided. 
    Example: If search string is "a", it will return all elements containing "a" on their name or last name*/
    searchContact(searchString) {
        return this._contacts.filter(contact => `${contact.firstName} ${contact.lastName}`.match(new RegExp(`.*${searchString}.*`, 'gi')) )
    }
    /*removeContact will remove the element on index from the array of contacts*/
    removeContact(id) {
        let index = this._contacts.findIndex((element) => element.id == id)
        return this._contacts.splice(index, 1);
    }
}

//initialData is an array of contacts crated to have some initial data stored for testing.
const initialData = [
    new Contact({
        firstName: 'Karen',
        lastName: 'Planas',
        phoneNumber: '514-706-1905',
        address: '4014 rue de Verdun, Quebec. H4G1K9. Canada'
    }),
    new Contact({
        firstName: 'Quentin',
        lastName: 'Ventura',
        phoneNumber: '514-111-2222',
        address: '4014 rue de Verdun. Canada'
    }),
    new Contact({
        firstName: 'George',
        lastName: 'Clooney',
        phoneNumber: '154-633-6547',
        address: 'Alamo street No 37, The Town. JH23548. USA'
    })
]

//storing in contactBook new Contactbook with initialData
const contactBook = new ContactBook(initialData);

//using jquery > addContactCard is a function to "append" (insert content to the page) info of a given contact
const addContactCard = (contact) => {
    contactsListElement.append(
        `<li class="contactCard">
            <ul style="list-style-type:none;" class="contactInformation">
                <li>Name: ${contact.firstName}</li>
                <li>Last Name: ${contact.lastName}</li>
                <li>Phone Number: ${contact.phoneNumber}</li>
                <li>Address: ${contact.address}</li>
            </ul>
            <button id="deleteButton-${contact.id}" class="tooltip deleteButton">
                <img src="./img/delete.svg" alt="deleteIcon" class="icon">
                <span class="tooltiptext">Delete Contact</span>
            </button>
        </li>
    `)

    /* Delete contact*/
    $(`#deleteButton-${contact.id}`).click((event) => {
        contactBook.removeContact(contact.id);
        refreshContactList(contactBook.contacts);
    })
}

// refreshContactList function will take an array of contacts and "addContactCard" for every contact
const refreshContactList = (contacts) => {
    contactsListElement.empty(); // jquery ".empty" method Remove all child nodes (reset/clear)
    contacts.forEach(addContactCard);
}

// Refreshing contacts list with the current contacts
refreshContactList(contactBook.contacts); 

/******Contacts Menu option******/

//Below function will show Contacts
const showContacts = () => {
    contactsListElement.removeClass('hide');
    contactsListElement.addClass('show');
}

//Below function will hide Contacts
const closeContacts = () => {
    contactsListElement.removeClass('show');
    contactsListElement.addClass('hide');
}

/* "Contacts" click event > When the "Contacts" option is clicked the list of contacts will show, 
if is clicked again the list of contacts will hide*/
contactsMenuOption.click((event) => {
    if (contactsListElement.hasClass( "hide" )){
        refreshContactList(contactBook.contacts); 
        showContacts();
        closeSearchBar();
        closeAbout();
    }
    else {
        closeContacts();
    }
})

/******Search Menu option******/

//Below function will show search bar
const showSearchBar = () => {
    searchInput.removeClass('hide');
    searchInput.addClass('show');
}

//Below function will hide search bar
const closeSearchBar = () => {
    searchInput.removeClass('show');
    searchInput.addClass('hide');
}

//Below function will show the message for no contact found
const showNoContactFoundMessage = () => {
    $(".noContactFound").removeClass('hide');
    $(".noContactFound").addClass('show');
}

//Below function will hide the message for no contact found
const closeNoContactFoundMessage = () => {
    $(".noContactFound").removeClass('show');
    $(".noContactFound").addClass('hide');
}

/* "Search" click event > When the "Search" option is clicked the search bar will show, 
if is clicked again the search bar will hide*/
searchMenuOption.click((event) => {
    if (searchInput.hasClass("hide")){
        searchInput.val(''); // to clear the input (avoid showing previous value entered)
        showSearchBar();
        closeContacts();
        closeAbout();
    }
    else{
        closeSearchBar();
        closeNoContactFoundMessage();
        closeContacts();
    }

})

/* "Search" input change event > When string is entered on the search bar and the "Enter" key pressed, 
the string will be searched on the contacts list, if found the contact(s) card(s) will show
else a message will display refering no match have been found for the criteria provided*/
searchInput.change((event) => {
    const value = event.target.value;
    const result = contactBook.searchContact(value);
    if (result.length === 0){
        showNoContactFoundMessage();
        closeContacts();
        closeAbout();
    } else {
        refreshContactList(result);
        closeNoContactFoundMessage();
        showContacts();
    }
})

/******Add Menu option******/
/* The Add option will open a Modal box :
A modal is a dialog box/popup window that is displayed on top of the current page */
/* Got Modal examples from W3schools.com documentation https://www.w3schools.com/howto/howto_css_modals.asp */

//Below function will show the Modal
const openModal = () => {
    modal.removeClass('hide');
    modal.addClass('show');
}

//Below function will hide the Modal
const closeModal = () => {
    modal.removeClass('show');
    modal.addClass('hide');
}

/* "Add" click event > When the user clicks on "Add" the modal will open;
the input fields data will be reset (To avoid them to show previous information entered).*/
addContactMenuOption.click((event) => {
    openModal();
    modalForm[0].reset(); //".reset" will clear the inputs / reset the form
})

// "X" (close) click event within the Modal > When the user clicks on "X" the modal will closed.
$(".close").click((event) => {
    closeModal();
})

// When the user clicks anywhere outside of the modal-content, the modal will closed.
window.onclick = (event) => {
  if (event.target.id == modal.attr('id')) {
    closeModal();
  }
}

/* Modal Form submit event > When the user click on on the submit "Save input":
 new Contact will be created with the entered data,
 the Modal will closed;
 (if the Contacts list is visible, or if the user click the Contacts option, the new contact will show)
*/ 
modalForm.submit((event) => {
    event.preventDefault() // to bypass the default behavior of the submit 
    contactBook.addContact(new Contact({
        address: $("#addrressInput").val(), // .val() jquery to Get the current value entered on that field
        firstName: $("#firstNameInput").val(), 
        lastName: $("#lastNameInput").val(), 
        phoneNumber: $("#phoneNumberInput").val(), 
    }));
    refreshContactList(contactBook.contacts);
    closeModal();
})

/******About Menu option******/

//Below function will display the "About" content
const openAbout = () => {
    about.removeClass('hide');
    about.addClass('show');
}

//Below function will hide the "About" content
const closeAbout = () => {
    about.removeClass('show');
    about.addClass('hide');
}

//On the "About" click event the content will show/hide.
aboutMenuOption.click((event) => {
    if (about.hasClass("hide")) {
        openAbout();
        closeContacts();
        closeSearchBar();
        closeNoContactFoundMessage();
    }
    else{
        closeAbout();
    }
})
