using System.Linq;
using Cartas.Web.Domain;
using Cartas.Web.Domain.Catan.Logic;
using Cartas.Web.Domain.Catan.Models;
using Cartas.Web.Models.Catan;
using Microsoft.AspNetCore.Mvc;

namespace Cartas.Web.Controllers
{
    public class CatanController : Controller
    {
        public ActionResult Index()
        {
            if (PlayerService.GetPlayer(Request.Cookies) == null)
                return RedirectToAction("Register", "Player");

            var model = new CatanIndexViewModel
            {
                ActiveGames = CatanApp.Games.Select(x => new CatanGameItemViewModel
                {
                    Id = x.GameId,
                    PlayerCount = x.PlayerCount,
                    MasterPlayer = x.MasterPlayer.PlayerName
                })
            };

            return View(model);
        }

        [HttpPost]
        public ActionResult Create()
        {
            var masterPlayer = ToCatanPlayer(PlayerService.GetPlayer(Request.Cookies));

            var game = CatanApp.CreateGame(masterPlayer);

            return RedirectToAction("Play", new { gameId = game.GameId });
        }

        public ActionResult Play(string gameId)
        {
            var identityPlayer = PlayerService.GetPlayer(Request.Cookies);
            if (identityPlayer == null) return RedirectToAction("Register", "Player");

            var game = CatanApp.GetGame(gameId);
            if (game == null) return RedirectToAction("Index");

            var player = ToCatanPlayer(identityPlayer);
            if (game.AddPlayer(player) == false) return RedirectToAction("Index");

            return View(new PlayCatanGameViewModel
            {
                Game = game,
                ThisPlayer = game.GetPlayer(player.PlayerId)
            });
        }

        private static CatanPlayer ToCatanPlayer(Domain.Models.Player identityPlayer)
        {
            return new CatanPlayer
            {
                PlayerId = identityPlayer.PlayerId,
                PlayerName = identityPlayer.PlayerName,
                Avatar = identityPlayer.Avatar
            };
        }
    }
}
