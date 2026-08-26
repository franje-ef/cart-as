using System.Threading.Tasks;
using Cartas.Web.Domain.Catan.Logic;
using Microsoft.AspNetCore.SignalR;

namespace Cartas.Web.Hubs
{
    public class CatanHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var playerId = Context.GetHttpContext().Request.Query["PlayerId"].ToString();
            var gameId = Context.GetHttpContext().Request.Query["GameId"].ToString();

            var game = CatanApp.GetGame(gameId);
            var player = game.GetPlayer(playerId);

            await Clients.Group(gameId).SendAsync("playerConnected", player);

            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

            await base.OnConnectedAsync();
        }

        public async Task StartGame()
        {
            var playerId = Context.GetHttpContext().Request.Query["PlayerId"].ToString();
            var gameId = Context.GetHttpContext().Request.Query["GameId"].ToString();
            var game = CatanApp.GetGame(gameId);

            if (game.MasterPlayer.PlayerId == playerId)
            {
                game.Start();
                await Clients.Group(gameId).SendAsync("onGameStarted");
            }
        }

        public async Task RemovePlayer(int seat)
        {
            var playerId = Context.GetHttpContext().Request.Query["PlayerId"].ToString();
            var gameId = Context.GetHttpContext().Request.Query["GameId"].ToString();

            var game = CatanApp.GetGame(gameId);
            if (game.MasterPlayer.PlayerId == playerId)
            {
                var removedPlayerId = game.RemovePlayer(seat);
                await Clients.Group(gameId).SendAsync("onPlayerRemoved", seat, removedPlayerId);
            }
        }
    }
}
