using System;
using System.Collections.Generic;
using Cartas.Web.Domain.Models;

namespace Cartas.Web.Domain.Logic
{
    public static class App
    {
        public static List<Game> Games = new List<Game>();

        public static Game CreateGame(GameType gameType, Player masterPlayer)
        {
            var id = new Random().Next(1000, 100000).ToString();

            var game = new Game(id, gameType, masterPlayer);

            Games.Add(game);

            return game;
        }
    }
}