namespace Cartas.Web.Domain.Logic
{
    public static class Tools
    {
        public static int GetDecksFromPlayerCount(int playerCount)
        {
            var totalDecks = 1;

            switch (playerCount)
            {
                case var n when n <= 2:
                    totalDecks = 1;
                    break;

                case var n when (n > 2 && n <= 4):
                    totalDecks = 2;
                    break;

                case var n when (n > 4 && n <= 6):
                    totalDecks = 3;
                    break;

                case var n when (n > 6):
                    totalDecks = 4;
                    break;
            }

            return totalDecks;
        }
    }
}