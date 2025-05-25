public interface IAuthService
{
    Task<string> LoginWithGoogleAsync(string token);
}