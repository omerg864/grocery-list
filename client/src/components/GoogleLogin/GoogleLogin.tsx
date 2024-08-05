import { useGoogleLogin } from "@react-oauth/google";
import "./GoogleLogin.css";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";


interface GoogleLoginProps {
	authResponse: (authResult: any) => void;
}

function GoogleLogin(props: GoogleLoginProps) {

	const { t } = useTranslation('translation', { keyPrefix: 'Generic' });

	const googleLogin = useGoogleLogin({
		onSuccess: props.authResponse,
		onError: props.authResponse,
		flow: "auth-code",
	});

	return (
		<button onClick={googleLogin} className="googleSignIn googleSignIn--white">
			<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/G-on-clear.svg" alt="Google logo" />
			<Typography className="googleSignIn__text">{t('google')}</Typography>
		</button>
	);
};

export default GoogleLogin;