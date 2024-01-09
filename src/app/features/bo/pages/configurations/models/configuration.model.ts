export interface Configuration {
    id: string;
    logo: string;
    logo_white: string;
    logo_icon: string;
    main_image: string;
    main_title: string;
    main_title_tr: string;
    second_title: string;
    second_title_tr: string;
    promo_images: string[]; // string[];
    promo_videos: string[];
    contact_form_label: string;
    phone_number: string; // string[];
    email: string; // string[];
    address: string; // string[];
    facebook_link: string;
    insta_link: string;

    // invite part
    invite_from: string;
    invite_subject: string;
    invite_credentials_message: string;
    invite_credentials_email_label: string;
    invite_credentials_password_label: string;
    invite_login_message: string;
    invite_thank_you_message: string;
    invite_phone_number_icon: string;
    invite_email_icon: string;
    invite_location_icon: string;
}