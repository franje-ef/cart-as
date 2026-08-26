using System;
using System.Collections.Generic;
using System.Linq;
using Cartas.Web.Domain.Catan.Models;

namespace Cartas.Web.Domain.Catan.Logic
{
    public static class CatanApp
    {
        public static List<CatanGame> Games = new List<CatanGame>();

        public static CatanGame CreateGame(CatanPlayer masterPlayer)
        {
            var id = new Random().Next(1000, 100000).ToString();

            var game = new CatanGame(id, masterPlayer);

            Games.Add(game);

            return game;
        }

        public static CatanGame GetGame(string id)
        {
            return Games.SingleOrDefault(x => x.GameId == id);
        }
    }
}
