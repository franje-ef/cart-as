namespace Cartas.Web.Domain
{
    public static class Constants
    {
        public static int[] Seats = {1, 3, 8, 6, 10, 4, 9, 3, 2, 7};
        public static int MaxPlayers => Seats.Length;
    }

    public enum GameType
    {
        Romi
    }
}