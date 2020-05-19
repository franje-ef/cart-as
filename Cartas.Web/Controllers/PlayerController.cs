using System.IO;
using System.Linq;
using System.Web.Mvc;
using Cartas.Web.Domain;
using Cartas.Web.Models;

namespace Cartas.Web.Controllers
{
    public class PlayerController : Controller
    {
        public ActionResult Register()
        {
            var model = new RegisterPlayerViewModel();
            model.AvatarList = Directory.GetFiles(Server.MapPath("~/Content/img/avatars"))
                .Select(Path.GetFileName)
                .ToList();

            return View(model);
        }

        [HttpPost]
        public ActionResult Register(RegisterPlayerViewModel model)
        {
            var cookie = PlayerService.CreatePlayerCookie(model.Name, model.Avatar);

            Response.Cookies.Add(cookie);

            return RedirectToAction("Index", "Game");
        }
    }
}