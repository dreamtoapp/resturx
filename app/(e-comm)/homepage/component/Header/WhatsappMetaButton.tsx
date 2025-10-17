"use client"
import WhatsAppButton from '@/components/WhatsAppButton';
import { ButtonProps } from '@/components/ui/button';

interface WhatsappMetaButtonProps extends Omit<ButtonProps, 'onClick'> {
    phone?: string; // Optional: allow custom phone number
    defaultMessage?: string;
}

const WhatsappMetaButton: React.FC<WhatsappMetaButtonProps> = ({ phone = '', defaultMessage = '', ...props }) => {
    return (
        <WhatsAppButton
            phone={phone}
            defaultMessage={defaultMessage}
            buttonVariant="icon"
            className="flex items-center justify-center border"
            {...props}
        />
    );
};

export default WhatsappMetaButton; 