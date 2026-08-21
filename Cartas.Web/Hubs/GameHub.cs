using System.Threading.Tasks;
using Cartas.Web.Domain;
using Cartas.Web.Domain.Logic;
using Cartas.Web.Domain.Models;
using Microsoft.AspNetCore.SignalR;

namespace Cartas.Web.Hubs
{
    public class GameHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var playerId = Context.GetHttpContext().Request.Query["PlayerId"].ToString();
            var gameId = Context.GetHttpContext().Request.Query["GameId"].ToString();

            var game = App.GetGame(gameId);
            var player = game.GetPlayer(playerId);

            await Clients.Group(gameId).SendAsync("playerConnected", player);

            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

            await base.OnConnectedAsync();
        }

        public async Task StartGame()
        {
            var playerId = Context.GetHttpContext().Request.Query["PlayerId"].ToString();
            var gameId = Context.GetHttpContext().Request.Query["GameId"].ToString();
            var game = App.GetGame(gameId);

            if (game.MasterPlayer.PlayerId == playerId)
            {
                game.Start();
                await Clients.Group(gameId).SendAsync("onGameStarted");
            }
        }

        public async Task ChangeGoal()
        {
            var playerId = Context.GetHttpContext().Request.Query["PlayerId"].ToString();
            var gameId = Context.GetHttpContext().Request.Query["GameId"].ToString();
            var game = App.GetGame(gameId);

            if (game.MasterPlayer.PlayerId == playerId)
            {
                var goal = game.ChangeGoal();
                await Clients.Group(gameId).SendAsync("onGoalChanged", goal);
            }
        }

        public async Task<bool> PlayCard(int num, int suit)
        {
            var playerId = Context.GetHttpContext().Request.Query["PlayerId"].ToString();
            var gameId = Context.GetHttpContext().Request.Query["GameId"].ToString();

            var game = App.GetGame(gameId);
            var player = game.GetPlayer(playerId);
            var result = game.PlayCard(player, new Card(num, suit));

            if (result)
            {
                await Clients.OthersInGroup(gameId).SendAsync("onCardPlayed", player.Seat, num, suit);
                await Clients.Caller.SendAsync("onCardPlayed", 0, num, suit);
                await Clients.Group(gameId).SendAsync("onTurnChanged", game.SeatTurn);
            }

            return result;
        }

        public Task<Card> TakeDeckCard()
        {
            var playerId = Context.GetHttpContext().Request.Query["PlayerId"].ToString();
            var gameId = Context.GetHttpContext().Request.Query["GameId"].ToString();

            var game = App.GetGame(gameId);
            var player = game.GetPlayer(playerId);
            var result = game.TakeDeckCard(player);

            return Task.FromResult(result);
        }

        public async Task<Card> TakePlayedCard()
        {
            var playerId = Context.GetHttpContext().Request.Query["PlayerId"].ToString();
            var gameId = Context.GetHttpContext().Request.Query["GameId"].ToString();

            var game = App.GetGame(gameId);
            var player = game.GetPlayer(playerId);
            var result = game.TakePlayedCard(player);

            if (result != null)
            {
                await Clients.Group(gameId).SendAsync("onPlayedCardTaken");
            }

            return result;
        }

        public async Task SendReaction(string reactionId)
        {
            var playerId = Context.GetHttpContext().Request.Query["PlayerId"].ToString();
            var gameId = Context.GetHttpContext().Request.Query["GameId"].ToString();

            var game = App.GetGame(gameId);
            var player = game.GetPlayer(playerId);

            await Clients.Group(gameId).SendAsync("onReactionSent", player.Seat, reactionId);

            var response = game.React(playerId, reactionId);

            switch (response)
            {
                case ReactResponse.PotentialWinnerWon:
                    await Clients.Group(gameId).SendAsync("onPlayerWon", game.PotentialWinner.Player.PlayerId);
                    break;
                case ReactResponse.PotentialWinnerLost:
                    await Clients.Group(gameId).SendAsync("onPlayerClaimingVictoryLost");
                    break;
            }
        }

        public async Task RemovePlayer(int seat)
        {
            var playerId = Context.GetHttpContext().Request.Query["PlayerId"].ToString();
            var gameId = Context.GetHttpContext().Request.Query["GameId"].ToString();

            var game = App.GetGame(gameId);
            if (game.MasterPlayer.PlayerId == playerId)
            {
                var removedPlayerId = game.RemovePlayer(seat);

                await Clients.Group(gameId).SendAsync("onPlayerRemoved", seat, removedPlayerId);

                if(game.Started)
                    await Clients.Group(gameId).SendAsync("onTurnChanged", game.SeatTurn);
            }
        }

        public async Task ClaimVictory()
        {
            var playerId = Context.GetHttpContext().Request.Query["PlayerId"].ToString();
            var gameId = Context.GetHttpContext().Request.Query["GameId"].ToString();

            var game = App.GetGame(gameId);

            if (game.PotentialWinner != null && game.PotentialWinner.Player.PlayerId == playerId)
            {
                await Clients.Group(gameId).SendAsync("onPlayerClaimedVictory", game.PotentialWinner.Player.PlayerId);
            }
        }
    }
}
