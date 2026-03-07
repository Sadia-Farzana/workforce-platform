using MassTransit;
using WorkforceAPI.src.Application.Interfaces;

namespace WorkforceAPI.src.Infrastructure.Messaging
{
    public class MassTransitEventPublisher(IPublishEndpoint publishEndpoint) : IEventPublisher
    {
        public async Task PublishAsync<T>(T domainEvent, CancellationToken ct = default) where T : class
            => await publishEndpoint.Publish(domainEvent, ct);
    }
}
