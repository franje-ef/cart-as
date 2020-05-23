namespace Cartas.Web.Domain
{
    public static class Constants
    {
        public static int[] Seats = {1, 3, 8, 6, 10, 4, 9, 3, 2, 7};
        public static int MaxPlayers => Seats.Length;
        public static int InitialCardCount = 10;
        public static string [] Goals =  {"1 trío y 1 seguidilla", "2 tríos y 1 seguidilla", "3 tríos", "2 seguidillas", "libre"};
    }

    public enum GameType
    {
        Romi
    }

    public enum RomiGoal
    {
        
    }
}