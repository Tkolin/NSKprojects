import React from 'react';
import ContactForm from "../components/form/modelsForms/ContactForm";
import {StyledBlockBig, StyledBlockRegular} from "../components/style/BlockStyles";


const ContactPage = () => {
    return (
        <StyledBlockRegular>
            <ContactForm/>
        </StyledBlockRegular>
     );
};

export default ContactPage;
