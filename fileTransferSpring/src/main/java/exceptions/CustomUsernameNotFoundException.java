package exceptions;

public class CustomUsernameNotFoundException extends RuntimeException {
    public CustomUsernameNotFoundException(String message) {
        super(message);
    }
}