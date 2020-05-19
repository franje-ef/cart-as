using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Cartas.Web.Domain;
using Cartas.Web.Domain.Logic;
using Cartas.Web.Domain.Models;
using Cartas.Web.Models;

namespace Cartas.Web.Controllers
{
    public class GameController : Controller
    {
        public ActionResult Index()
        {
            if (PlayerService.GetPlayer(Request.Cookies) == null)
                return RedirectToAction("Register", "Player");

            var model = new IndexViewModel();
            model.ActiveGames = App.Games.Select(x => new GameItemViewModel
            {
                Id = x.GameId,
                PlayerCount = x.Players.Count,
                Type = x.GameType.ToString(),
                MasterPlayer = x.MasterPlayer.PlayerName
            });
            
            return View(model);
        }

        [HttpPost]
        public ActionResult Create(FormCollection form)
        {
            var masterPlayer = PlayerService.GetPlayer(Request.Cookies);
            var gameType = (GameType) Enum.Parse(typeof(GameType), form["GameType"]);

            var game = App.CreateGame(gameType, masterPlayer);

            return RedirectToAction("Play", new {gameId = game.GameId});
        }

        public ActionResult Play(string gameId)
        {
            return View(new PlayGameViewModel
            {
                Game = new Game("1234", GameType.Romi, new Player())
            });
        }

        public ActionResult Mock(string gameId)
        {
            return View("Play", new PlayGameViewModel
            {
                Game = new Game("1234", GameType.Romi, new Player())
            });
        }
    }
}