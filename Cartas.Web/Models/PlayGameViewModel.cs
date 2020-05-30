using System.Collections.Generic;
using Cartas.Web.Domain.Logic;
using Cartas.Web.Domain.Models;

namespace Cartas.Web.Models
{
    public class PlayGameViewModel
    {
        public Game Game { get; set; }
        public Player ThisPlayer { get; set; }
        public List<string> AvatarList { get; set; }
    }
}