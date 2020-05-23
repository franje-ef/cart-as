using System.Threading.Tasks;
using Cartas.Web.Domain.Logic;
using Microsoft.AspNet.SignalR;

namespace Cartas.Web.Hubs
{
    public class GameHub : Hub
    {
        public override Task OnConnected()
        {
            var playerId = Context.QueryString["PlayerId"];
            var gameId = Context.QueryString["GameId"];

            var game = App.GetGame(gameId);
            var player = game.GetPlayer(playerId);

            Clients.Group(gameId).playerConnected(player);

            Groups.Add(Context.ConnectionId, gameId);

            return base.OnConnected();
        }
    }
}