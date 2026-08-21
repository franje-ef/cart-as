using System;
using System.IO;
using System.Linq;
using Cartas.Web.Domain;
using Cartas.Web.Domain.Logic;
using Cartas.Web.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Cartas.Web.Controllers
{
    public class GameController : Controller
    {
        private readonly IWebHostEnvironment _env;

        public GameController(IWebHostEnvironment env)
        {
            _env = env;
        }

        public ActionResult Index()
        {
            if (PlayerService.GetPlayer(Request.Cookies) == null)
                return RedirectToAction("Register", "Player");

            var model = new IndexViewModel();
            model.ActiveGames = App.Games.Select(x => new GameItemViewModel
            {
                Id = x.GameId,
                PlayerCount = x.PlayerCount,
                Type = x.GameType.ToString(),
                MasterPlayer = x.MasterPlayer.PlayerName
            });

            return View(model);
        }

        [HttpPost]
        public ActionResult Create([FromForm(Name = "GameType")] string gameType)
        {
            var masterPlayer = PlayerService.GetPlayer(Request.Cookies);
            var parsedGameType = (GameType) Enum.Parse(typeof(GameType), gameType);

            var game = App.CreateGame(parsedGameType, masterPlayer);

            return RedirectToAction("Play", new {gameId = game.GameId});
        }

        public ActionResult Play(string gameId)
        {
            var player = PlayerService.GetPlayer(Request.Cookies);
            if (player == null) return RedirectToAction("Register", "Player");

            var game = App.GetGame(gameId);
            if (game == null) return RedirectToAction("Index");

            if(game.AddPlayer(player) == false) return RedirectToAction("Index");

            return View(new PlayGameViewModel
            {
                Game = game,
                ThisPlayer = game.GetPlayer(player.PlayerId),
                AvatarList = Directory.GetFiles(Path.Combine(_env.WebRootPath, "Content", "img", "avatars")).Select(Path.GetFileName).ToList()
        });
        }

        [HttpPost]
        public void Snapshot(SnapshotViewModel model)
        {
            var player = PlayerService.GetPlayer(Request.Cookies);
            if (player == null) return;

            var game = App.GetGame(model.GameId);
            var cleansedBase64 = model.Base64.Substring(model.Base64.IndexOf("base64,") + 7);

            game.SetSnapshot(player, cleansedBase64);
        }

        public ActionResult Snapshot(string gameId)
        {
            var game = App.GetGame(gameId);

            var contents = Convert.FromBase64String(game.PotentialWinner.Snapshot);

            return File(contents, "image/png");
        }
    }
}
