public class UserDto
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required DateTime LastLoggedIn { get; set; }
    public required string PictureProfilPath { get; set; }
    public string? Pseudo { get; set; }
}