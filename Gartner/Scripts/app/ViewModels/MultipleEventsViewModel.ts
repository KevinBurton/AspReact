module Gartner {

	export class MultipleEventsViewModel {

		private itemId: number;
		private sectionsToUpdateOnSave: Array<string>;
		private loadModal: boolean;

		private speakersOutsideEvent: Array<ProposedSpeaker>;
		private externalSpeaker: Array<ExternalSpeaker>;
		private modalSelector = "#addMultiEventTrack-modal";
		private eventInputId = "add-event-name";
		

		private itemParent = ko.observable<ItemParent>();
		private selectedEventId = ko.observable<number>();
		private events = ko.observableArray<Event>();
		private canAdd = ko.observable<boolean>(false);
		private eventToAdd: Event;
		private isLoading = ko.observable<boolean>(false);
		private isSaving = ko.observable<boolean>(false);

		private canHaveMultipleEvents = ko.observable<boolean>(false);
		private canUpdateTracks = ko.observable<boolean>(false);
		private canAddEvents = ko.observable<boolean>(false);
        private canRemoveEvent = ko.observable<boolean>(false);
        private canRemoveTracks = ko.observable<boolean>(false);
		
		// ko.computed
		private showEventSelection: any;
		private canSave: any;
		private showRemove: any;
		private sortedEvents: any;
		

        onReady(json: { itemId: number; sectionsToUpdateOnSave: Array<string>; loadModal: boolean }) {
			this.itemId = json.itemId;
			this.sectionsToUpdateOnSave = json.sectionsToUpdateOnSave;
			this.loadModal = json.loadModal;
			
			$("body")
				.off("click", "[id='Edit Event']")
				.on("click", "[id='Edit Event']", this.onEditEvent);
			this.selectedEventId.subscribe(this.onSelectEvent);

			this.showEventSelection = ko.computed(() => {
				var canHaveMultipleEvents = this.canHaveMultipleEvents();
			    var eventsCount = 0;
                if (this.events() !== undefined) {
                    eventsCount = this.events().length;
                }
				var canAddEvents = this.canAddEvents();

				if (!canAddEvents) {
					return false;
				}

				return (!canHaveMultipleEvents && eventsCount === 0) || canHaveMultipleEvents;
			});

			this.showRemove = ko.computed(() => {
				var canAddEvents = this.canAddEvents();
				var canRemoveEvent = this.canRemoveEvent();

				return canAddEvents || canRemoveEvent;
			});

			this.canSave = ko.computed(() => {
				var isLoading = this.isLoading();
				var isSaving = this.isSaving();
				var events = this.events();
                var canRemoveEvent = this.canRemoveEvent();
                var eventCount = 0;

                if (this.events() !== undefined) {
                    eventCount = events.length;
                }
                var eventsAreValid = eventCount > 0 || (eventCount === 0 && canRemoveEvent);

				return !isLoading && !isSaving && eventsAreValid;
			});

			this.sortedEvents = ko.computed(() => {
				return (this.events() || []).sort((a, b) => {
					if (a.isSource()) {
						return -1;
					}

					if (b.isSource()) {
						return 1;
					}

					return a.title < b.title ? -1 : 1;
				});
			});

            var element = $(this.modalSelector)[0];
            ko.cleanNode(element);

			ko.applyBindings(this, $(this.modalSelector)[0]);
			if (this.loadModal) {
				this.onEditEvent();
			} 

			$('body').on('hidden.bs.modal', '.modal', () => {
                $(this).removeData('bs.modal');
			});
		}
	
		onEditEvent = (event?: JQueryEventObject) => {
			if (event) {
				event.preventDefault();
            }
		    this.events(undefined);
			this.clearEventInput();
            $(this.modalSelector).modal("show");
            this.getAll();
		}

		getAll = () => {
			this.isLoading(true);
			EventTrackService.getEventAndTrackByItemId(this.itemId)
				.done(response => this.onGetAll(response))
				.always(() => this.isLoading(false));
		}

        onGetAll = (response: ReceiveAllResponse) => {
            if (!response) return;

			if (response.ParentItem) {
				this.itemParent(
					new ItemParent(
						response.ParentItem.ItemId,
						response.ParentItem.Relationship,
						response.ParentItem.Title,
						response.ParentItem.PrimaryAuthor,
						response.ParentItem.CoAuthors,
						new Event(this.canRemoveTracks, response.ParentItem.Event)
						)
					);
			} else {
				this.itemParent(undefined);
			}

			if (response.Events) {
				this.events(response.Events.map(response => new Event(this.canRemoveTracks, response)));
			}

			if (response.SpeakersOutsideEvent) {
				this.speakersOutsideEvent =
                    response.SpeakersOutsideEvent.map(speaker => new ProposedSpeaker(speaker.SpeakerName, speaker.EmployeeId, new SpeakerRole(speaker.SpeakerRole.RoleId, speaker.SpeakerRole.RoleDescription)));
			}

			if (response.ExternalSpeakers) {
				this.externalSpeaker = response.ExternalSpeakers.map(speaker => new ExternalSpeaker(speaker.SpeakerName));
			}

			this.canHaveMultipleEvents(response.CanHaveMultipleEvents || false);
			this.canUpdateTracks(response.CanUpdateTracks || false);
            this.canRemoveEvent(response.CanRemoveEvent || false);
		    this.canRemoveTracks(response.CanRemoveTracks || false);
            this.canAddEvents(response.CanAddEvents || false);
		}

		onSelectEvent = (eventId: number) => {
			if (!eventId || isNaN(eventId)) return;

			EventTrackService.getEventByEventId(eventId)
				.done(response => {
					var eventAlreadyExists = this.events().filter((e: Event) => e.isEqual(response.Event.EventId)).length > 0;

					if (!eventAlreadyExists) {
						this.eventToAdd = new Event(this.canRemoveTracks, response.Event, response.Tracks);
						this.canAdd(true);
					} else {
						this.canAdd(false);
					}
				});
		}

		setEventAsSource = (event: Event) => {
			if (event.isSource()) return;
			this.events().forEach(e => e.isSource(false));
			event.isSource(true);
			event.relationshipType(undefined);
		}

		addEvent = () => {
			if (this.canAdd() && this.eventToAdd) {
				if (!this.events().length) {
					this.eventToAdd.isSource(true);
					if (this.speakersOutsideEvent) {
						this.eventToAdd.proposedSpeakers(this.speakersOutsideEvent);
					}
				}
				this.events.push(this.eventToAdd);
				this.canAdd(false);
				this.eventToAdd = null;
				this.clearEventInput();
			}
		}

		clearEventInput = () => {
			this.eventToAdd = undefined;
			this.canAdd(false);
			this.selectedEventId(undefined);
			$("#" + this.eventInputId).val("");
			var comboBox = $("#" + this.eventInputId).data("kendoComboBox");
			if (comboBox) {
				comboBox.destroy();
			}

			this.initEventComboBox();
		}

		initEventComboBox() {
			$("#" + this.eventInputId).kendoComboBox(<any>{
				dataSource: EventTrackService.getEventsComboBoxDataSource(this.eventInputId),
				dataTextField: "DisplayText",
				delay: 400,
				filter: "contains",
				minLength: 1,
				autoBind: false,
				dataValueField: "EventId",
				highlightFirst: true,
				placeholder: "search event by name..."
			});
		}

		removeEvent = (event: Event) => {
			this.events.remove(event);
			if (event.isSource() && this.events().length) {
				this.events()[0].isSource(true);
				this.events()[0].relationshipType(undefined);
			}
		}

		cancel() {
			ErrorUtilities.clearErrors();
		}

		save = () => {
			var isMissingRelationshipInformation =
				this.events()
					.filter(event => {
						return !event.isSource() && !event.relationshipType();
					})
					.length > 0;

			if (isMissingRelationshipInformation) {
				this.showRelationshipMissingError();
				return;
			}

			var json = JSON.stringify(this.events().map(event => event.toJSON(this.itemId)));

			this.isSaving(true);
			EventTrackService.save(this.itemId, json)
				.done(response => {
					if (response.exceptionMessage) {
					    ErrorUtilities.showErrorFromResponse(response);
					    return;
					} else {
                        toastr.success("Events Saved");
					}

					$(this.modalSelector).modal("hide");
					UpdateHelper.updateAjaxPanels(this.sectionsToUpdateOnSave);					
				})
				.always(() => {
					setTimeout(() => {
						this.isSaving(false);
					}, 200);
				});
		}

		showRelationshipMissingError() {
			ErrorUtilities.showErrorMessage("Event Save Failed", "You must select relationship types for all events that aren't the source event.");
		}

	}

	class ItemParent {
		private itemId: number;
		private relationshipType: string;
		private title: string;
		private primaryAuthor: string;
		private coAuthors: Array<string>;
		private event: Event;

		constructor(itemId, relationshipType, title, primaryAuthor, coAuthors, event: Event) {
			this.itemId = itemId;
			this.relationshipType = relationshipType;
			this.title = title;
			this.primaryAuthor = primaryAuthor;
			this.coAuthors = coAuthors;
			this.event = event;
		}
	}

	class Event {
		id: number;
		code: string;
		private itemDetailsId: number;
		title: string;
		private startDate: string;
		private region: string;
		private conferenceChair: string;

		isSource = ko.observable<boolean>(false);
		relationshipType = ko.observable<number>();

		private selectedTrackId = ko.observable<number>();
		private tracks = ko.observableArray<Track>();
		private selectedSpeaker = ko.observable();
		private selectedExternalSpeaker = ko.observable();
		private speakerExternalToAdd: ExternalSpeaker;
        private speakerToAdd: ProposedSpeaker;
        private speakerRole: SpeakerRole;
        private selectedRole = ko.observable();
        speakerRoles = ko.observableArray<SpeakerRole>();
		proposedSpeakers = ko.observableArray<ProposedSpeaker>();
		externalSpeakers = ko.observableArray<ExternalSpeaker>();
		private canAddSpeaker = ko.observable<boolean>(false);
		private canAddExternalSpeaker = ko.observable<boolean>(true);
        private removeTrackVisible: any;
		private canRemoveTracks: any;

		constructor(canRemoveTracks : any, eventResponse: EventResponse, tracks?: Array<TrackResponse>);
        constructor(canRemoveTracks: any, eventResponse: FullEventResponse, tracks?: Array<TrackResponse>) {
			this.id = eventResponse.EventId;
			this.code = eventResponse.Code;
			this.itemDetailsId = eventResponse.Id;
			this.title = eventResponse.Title;
			this.conferenceChair = eventResponse.ConferenceChair;
			this.startDate = eventResponse.FormattedStartDate;
			this.region = eventResponse.Region;
			this.canRemoveTracks = canRemoveTracks;

			var proposedSpeakers = (eventResponse.Speakers || []).map((p) => {
                return new ProposedSpeaker(p.SpeakerName, p.EmployeeId, new SpeakerRole(p.SpeakerRole.RoleId, p.SpeakerRole.RoleDescription));
            });
			this.proposedSpeakers(proposedSpeakers);

			var externalSpeakers = (eventResponse.ExternalSpeakers ||[]).map((z) => {
					return new ExternalSpeaker(z.SpeakerName);
				});
			this.externalSpeakers(externalSpeakers);

			this.isSource(eventResponse.IsParent || false);

			if (!this.isSource()) {
				this.relationshipType(eventResponse.RelationshipTypeId || undefined);
			}
			this.removeTrackVisible = ko.computed(() => {
				if (this.canRemoveTracks()) {
					return this.selectedTrackId();
				}
				return this.canRemoveTracks();
			});

			if (tracks) {
				this.tracks(tracks.map(t => new Track(t)));
			} else if (eventResponse.AllTracks) {
				this.tracks(eventResponse.AllTracks.map(t => new Track(t)));
			}

			if (eventResponse.Tracks && eventResponse.Tracks.length) {
				var trackId = eventResponse.Tracks[0].TrackId;
				var hasTrack = this.tracks().filter(t => t.id === trackId).length > 0;
				if (hasTrack) {
					this.selectedTrackId(trackId);	
				}
			}

            this.selectedSpeaker.subscribe(this.onSelectSpeaker);
			this.selectedRole.subscribe(this.onSelectSpeakerRole);
			this.selectedExternalSpeaker.subscribe(this.onSelectExternalSpeaker);

		}

		onSelectSpeaker = (newValue: any) => {
            if (!newValue) return;

            var valueAsInt = parseInt(newValue, 10);
            var isEmployeeId = !isNaN(valueAsInt);
		    
			var speakerAlreadyExists = this.proposedSpeakers().filter((s: ProposedSpeaker) => {
				return isEmployeeId
					? s.isSpeakerWithEmployeeId(valueAsInt)
					: s.isSpeakerWithName(newValue);
			}).length > 0;

            if (speakerAlreadyExists) return;

			if (isEmployeeId) {
				EventTrackService.getEmployeeFullNameByEmployeeId(newValue)
					.done(name => {
                        this.speakerToAdd = new ProposedSpeaker(name, newValue, undefined);
						this.canAddSpeaker(false);
					});
			} else {
				this.speakerToAdd = new ProposedSpeaker(newValue, undefined, undefined);
				this.canAddSpeaker(true);
            }
           
        }


		onSelectExternalSpeaker = (newValue: any) => {
			if (!newValue) return;
			this.speakerExternalToAdd = new ExternalSpeaker(newValue);
			this.canAddExternalSpeaker(true);
		}


        onSelectSpeakerRole = (newValue: any) => {
            if (!newValue) return;
            if (this.speakerToAdd == null) return;
            
            EventTrackService.getRoleDescriptionById(newValue)
                .done(name => {
                    this.speakerToAdd.speakerRole = new SpeakerRole(newValue, name);
                    this.canAddSpeaker(true);
                });
        }

		addSpeaker = () => {
			if (this.canAddSpeaker() && this.speakerToAdd) {
                this.proposedSpeakers.push(this.speakerToAdd);
                this.speakerToAdd = null;
			    this.speakerRole = null;
                this.canAddSpeaker(false);
			}
		}

		addExternalSpeaker = () => {
			if (this.canAddExternalSpeaker() && this.speakerExternalToAdd) {
				this.externalSpeakers.push(this.speakerExternalToAdd);
				this.speakerExternalToAdd = null;
				this.canAddExternalSpeaker(true);
			}
		}

		removeSpeaker = (speakerToRemove: ProposedSpeaker) => {
			this.proposedSpeakers.remove(speakerToRemove);
        }

		removeExternalSpeaker = (speakerToRemove: ExternalSpeaker) => {
			this.externalSpeakers.remove(speakerToRemove);
		}

        removeTrack = () => {
            this.selectedTrackId(null);
        }

		isEqual = (id: number) => {
			return this.id === id;
		}

        toJSON = (itemId: number) => {
            var json = {
                ItemDetailsId: this.itemDetailsId,
                ItemId: itemId,
                EventId: this.id,
                IsParent: this.isSource(),
                Tracks: this.selectedTrackId()
                    ? [{ TrackId: this.selectedTrackId(), IsPrimary: true }]
                    : [],
                RelationshipTypeId: this.relationshipType() || null,
				ProposedSpeaker: this.proposedSpeakers().map(speaker => speaker.toJSON()),
				ExternalSpeaker: this.externalSpeakers().map(externalSpeaker => externalSpeaker.toJSON())
            };
            
            return json;
        }

		getDashboardLink = () => {
			return "/EventDashboard/View/" + this.id;
        }

		getDataSource = (kind: string) => {
			switch (kind) {
				case "speakers":
                    return EventTrackService.getSpeakersComboBoxDataSource();
                case "speakerRoles":
                  //  return EventTrackService.getSpeakersRolesDataSource();
				default:
					return null;
			}
		}
	}

	class Track {
		id: number;
		code: string;
		title: string;
		trackManager: string;
		displayText: string;
	

		constructor(response: TrackResponse) {
			this.id = response.TrackId;
			this.code = response.Code;
			this.title = response.Title;
			this.trackManager = response.TrackManager;
			this.displayText = response.DisplayText;
		}
	}

	class ProposedSpeaker {
		employeeId: number;
        name: string;
        speakerRole: SpeakerRole;
        

        constructor(name: string, employeeId, speakerRole: SpeakerRole)
        {
			this.employeeId = employeeId ? parseInt(employeeId, 10) : undefined;
            this.name = name;
            this.speakerRole = speakerRole || null;

        }

		isSpeakerWithName = (name: any) => {
			return this.name === name;
		}

		isSpeakerWithEmployeeId = (employeeId: any) => {
			return this.employeeId === employeeId;
		}

		isEqual = (other: ProposedSpeaker) => {
			if (this.employeeId) {
				return this.employeeId === other.employeeId;
			} else {
				return this.name === other.name;
			}
        }

        toJSON = () => {
			return {
				EmployeeId: this.employeeId || null,
                SpeakerName: this.name, 
                SpeakerRole: this.speakerRole || null
			};
        }
        
    }

    class SpeakerRole  {
              roleId:  number;
              roleDescription:  string;

              constructor(roleId, roleDescription) {
                  this.roleId = roleId;
                  this.roleDescription = roleDescription;
              }

              toJSON  =  ()  =>  {
                      return  {
                              RoleId:  this.roleId,
                              RoleDescription:  this.roleDescription
                      };
              }

	}

	class ExternalSpeaker {
		name: string;

		constructor(name: string) {
			this.name = name;
		}

		isSpeakerWithName = (name: any) => {
			return this.name === name;
		}
		
		isEqual = (other: ExternalSpeaker) => {
			return this.name === other.name;
		}
		toJSON = () => {
			return {
				SpeakerName: this.name
			};
		}

	}
}