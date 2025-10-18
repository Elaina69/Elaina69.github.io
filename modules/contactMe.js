import contacts from '../configs/contacts.js'

class Contacts {
    addContact() {
        const socialLinks = document.querySelector('.social-links')
        contacts.forEach(contact => {
            const link = document.createElement('a')

            link.href = contact.link
            link.target = '_blank'
            link.className = 'social-icon'
            link.setAttribute('aria-label', contact.name)
            link.innerHTML = contact.icon

            socialLinks.appendChild(link)
        })
    }
}

export { Contacts }